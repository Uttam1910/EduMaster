// controllers/adminController.js
const prisma = require('../config/prismaClient');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { uploadVideoToCloudinary, deleteCloudinaryAsset } = require('../utils/cloudinaryHelper');

// Helper to format course object into clean API response
const formatCourseResponse = (course) => {
  if (!course) return null;

  const lectures = (course.lectures || []).map((l) => ({
    _id: l.id,
    id: l.id,
    title: l.title,
    description: l.description,
    lecture: {
      public_id: l.publicId,
      secure_url: l.secureUrl,
    },
    public_id: l.publicId,
    secure_url: l.secureUrl,
    orderIndex: l.orderIndex,
    createdAt: l.createdAt,
  }));

  const enrolledCount = course._count?.enrollments ?? course.enrollments?.length ?? 0;
  const numberOfLectures = course.numberOfLectures || lectures.length;

  return {
    _id: course.id,
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    createdBy: course.createdBy,
    thumbnail: {
      public_id: course.thumbnailPublicId,
      secure_url: course.thumbnailSecureUrl,
    },
    thumbnailPublicId: course.thumbnailPublicId,
    thumbnailSecureUrl: course.thumbnailSecureUrl,
    thumbnailUrl: course.thumbnailSecureUrl,
    numberOfLectures,
    enrolledCount,
    lectures,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};

/**
 * GET /api/admin/dashboard
 * Real database metrics for admin dashboard
 */
const getDashboardMetrics = async (req, res) => {
  try {
    const [totalCourses, totalStudents, totalAdmins, totalEnrollments, totalLectures] =
      await Promise.all([
        prisma.course.count(),
        prisma.user.count({ where: { role: 'student' } }),
        prisma.user.count({ where: { role: 'admin' } }),
        prisma.courseEnrollment.count(),
        prisma.lecture.count(),
      ]);

    const recentCoursesRaw = await prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        lectures: true,
        _count: { select: { enrollments: true } },
      },
    });

    const recentStudents = await prisma.user.findMany({
      where: { role: 'student' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        avatarSecureUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      metrics: {
        totalCourses,
        totalStudents,
        totalAdmins,
        totalEnrollments,
        totalLectures,
      },
      recentCourses: recentCoursesRaw.map(formatCourseResponse),
      recentStudents,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    res.status(500).json({ message: 'Failed to load admin metrics', error: error.message });
  }
};

/**
 * GET /api/admin/courses
 * Fetch searchable, filterable admin courses list
 */
const getAdminCourses = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lectures: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true, lectures: true } },
      },
    });

    res.status(200).json({
      courses: courses.map(formatCourseResponse),
    });
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    res.status(500).json({ message: 'Failed to fetch admin courses', error: error.message });
  }
};

/**
 * POST /api/admin/courses
 * Create new course with Cloudinary thumbnail upload
 */
const createAdminCourse = async (req, res) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    let thumbnailPublicId = 'default_thumbnail_id';
    let thumbnailSecureUrl =
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_thumbnails',
        resource_type: 'image',
      });

      thumbnailPublicId = uploadResult.public_id;
      thumbnailSecureUrl = uploadResult.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        createdBy: createdBy ? createdBy.trim() : 'EduMaster Admin',
        thumbnailPublicId,
        thumbnailSecureUrl,
      },
      include: {
        lectures: true,
        _count: { select: { enrollments: true } },
      },
    });

    res.status(201).json({
      message: 'Course created successfully',
      course: formatCourseResponse(course),
    });
  } catch (error) {
    console.error('Error creating admin course:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

/**
 * GET /api/admin/courses/:courseId
 * Fetch single course admin detail & statistics
 */
const getAdminCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lectures: { orderBy: { orderIndex: 'asc' } },
        enrollments: {
          include: {
            user: { select: { id: true, username: true, email: true, createdAt: true } },
          },
        },
        _count: { select: { enrollments: true, lectures: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      course: formatCourseResponse(course),
      enrolledStudents: course.enrollments.map((e) => ({
        id: e.user.id,
        username: e.user.username,
        email: e.user.email,
        enrolledAt: e.enrolledAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin course by ID:', error);
    res.status(500).json({ message: 'Failed to fetch course details', error: error.message });
  }
};

/**
 * PUT /api/admin/courses/:courseId
 * Update course details & handle optional thumbnail replacement with old asset cleanup
 */
const updateAdminCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, category, createdBy } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true, _count: { select: { enrollments: true } } },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category.trim();
    if (createdBy) updateData.createdBy = createdBy.trim();

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_thumbnails',
        resource_type: 'image',
      });

      // Cleanup old thumbnail from Cloudinary if not default
      await deleteCloudinaryAsset(existingCourse.thumbnailPublicId, 'image');

      updateData.thumbnailPublicId = uploadResult.public_id;
      updateData.thumbnailSecureUrl = uploadResult.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: {
        lectures: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    });

    res.status(200).json({
      message: 'Course updated successfully',
      course: formatCourseResponse(updatedCourse),
    });
  } catch (error) {
    console.error('Error updating admin course:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

/**
 * DELETE /api/admin/courses/:courseId
 * Delete course + cascade database cleanup + Cloudinary asset deletion
 */
const deleteAdminCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 1. Delete thumbnail from Cloudinary
    await deleteCloudinaryAsset(course.thumbnailPublicId, 'image');

    // 2. Delete all video lecture assets from Cloudinary
    for (const lec of course.lectures) {
      await deleteCloudinaryAsset(lec.publicId, 'video');
    }

    // 3. Cascade delete in PostgreSQL
    await prisma.course.delete({
      where: { id: courseId },
    });

    res.status(200).json({ message: 'Course and associated Cloudinary assets deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin course:', error);
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

/**
 * POST /api/admin/courses/:courseId/lectures
 * Add video lecture to course with bulletproof Cloudinary video upload
 */
const addAdminLecture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Video file is required' });
  }

  const filePath = req.file.path;

  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Safely upload video using helper
    const uploadResult = await uploadVideoToCloudinary(filePath, 'lectures');
    const { secure_url, public_id } = uploadResult;

    const newLecture = await prisma.lecture.create({
      data: {
        courseId,
        title: title ? title.trim() : 'Untitled Lecture',
        description: description ? description.trim() : '',
        publicId: public_id,
        secureUrl: secure_url,
        orderIndex: course.lectures.length + 1,
      },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { numberOfLectures: course.lectures.length + 1 },
    });

    res.status(201).json({
      message: 'Lecture added successfully',
      lecture: {
        id: newLecture.id,
        _id: newLecture.id,
        title: newLecture.title,
        description: newLecture.description,
        public_id: newLecture.publicId,
        secure_url: newLecture.secureUrl,
        orderIndex: newLecture.orderIndex,
      },
    });
  } catch (error) {
    console.error('Error adding admin lecture:', error);
    res.status(500).json({ message: 'Failed to add video lecture', error: error.message });
  } finally {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('Error cleaning up temp video file:', e.message);
    }
  }
};

/**
 * PUT /api/admin/lectures/:lectureId
 * Update lecture title or description
 */
const updateAdminLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, description, orderIndex } = req.body;

    const existingLecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    });

    if (!existingLecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (orderIndex !== undefined) updateData.orderIndex = parseInt(orderIndex, 10);

    const updatedLecture = await prisma.lecture.update({
      where: { id: lectureId },
      data: updateData,
    });

    res.status(200).json({
      message: 'Lecture updated successfully',
      lecture: {
        id: updatedLecture.id,
        _id: updatedLecture.id,
        title: updatedLecture.title,
        description: updatedLecture.description,
        public_id: updatedLecture.publicId,
        secure_url: updatedLecture.secureUrl,
        orderIndex: updatedLecture.orderIndex,
      },
    });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({ message: 'Failed to update lecture', error: error.message });
  }
};

/**
 * DELETE /api/admin/lectures/:lectureId
 * Delete lecture from database & Cloudinary
 */
const deleteAdminLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    });

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Delete Cloudinary video asset safely
    await deleteCloudinaryAsset(lecture.publicId, 'video');

    // Delete database record
    await prisma.lecture.delete({
      where: { id: lectureId },
    });

    // Update course lecture count
    const remainingCount = await prisma.lecture.count({
      where: { courseId: lecture.courseId },
    });

    await prisma.course.update({
      where: { id: lecture.courseId },
      data: { numberOfLectures: remainingCount },
    });

    res.status(200).json({ message: 'Lecture and video asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({ message: 'Failed to delete lecture', error: error.message });
  }
};

/**
 * GET /api/admin/users
 * Fetch list of users with enrollment counts & status
 */
const getAdminUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarPublicId: true,
        avatarSecureUrl: true,
        isActive: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
      },
    });

    const formattedUsers = users.map((u) => ({
      _id: u.id,
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      avatar: {
        public_id: u.avatarPublicId,
        secure_url: u.avatarSecureUrl,
      },
      avatarSecureUrl: u.avatarSecureUrl,
      isActive: u.isActive,
      enrolledCount: u._count.enrollments,
      createdAt: u.createdAt,
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

/**
 * PUT /api/admin/users/:userId/status
 * Toggle user active/inactive status
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: Boolean(isActive) },
    });

    res.status(200).json({
      message: `User status updated to ${updatedUser.isActive ? 'active' : 'inactive'}`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};

module.exports = {
  getDashboardMetrics,
  getAdminCourses,
  createAdminCourse,
  getAdminCourseById,
  updateAdminCourse,
  deleteAdminCourse,
  addAdminLecture,
  updateAdminLecture,
  deleteAdminLecture,
  getAdminUsers,
  toggleUserStatus,
};
