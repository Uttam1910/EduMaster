// controllers/courseController.js
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const prisma = require('../config/prismaClient');

// Helper to format course object into backward-compatible API response
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
  }));

  const enrolledStudents = (course.enrollments || []).map((e) => e.userId);

  return {
    _id: course.id,
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    createdBy: course.createdBy || 'EduMaster Admin',
    createdById: course.createdById,
    numberOfLectures: course.numberOfLectures || lectures.length,
    thumbnail: {
      public_id: course.thumbnailPublicId || 'default_thumbnail_id',
      secure_url: course.thumbnailSecureUrl || 'default_thumbnail_url',
    },
    lectures,
    enrolledStudents,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};

const uploadThumbnail = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'course_thumbnails',
      use_filename: true,
      unique_filename: false,
      resource_type: 'image',
    });

    req.body.thumbnail = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    if (req.body.createdBy) {
      req.body.createdBy = req.body.createdBy.trim();
    }

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
};

const createCourse = async (req, res) => {
  const { title, description, category, thumbnail, createdBy } = req.body;
  const userId = req.user?.id || req.user?._id;

  try {
    const newCourse = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        thumbnailPublicId: thumbnail?.public_id || 'default_thumbnail_id',
        thumbnailSecureUrl: thumbnail?.secure_url || 'default_thumbnail_url',
        createdBy: createdBy ? createdBy.trim() : req.user?.username || 'EduMaster Admin',
        createdById: userId || null,
        numberOfLectures: 0,
      },
      include: {
        lectures: true,
        enrollments: true,
      },
    });

    res.status(201).json({
      message: 'Course created successfully',
      course: formatCourseResponse(newCourse),
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, category, thumbnail, createdBy } = req.body;

  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true, enrollments: true },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category.trim();
    if (createdBy) updateData.createdBy = createdBy.trim();

    if (thumbnail) {
      if (existingCourse.thumbnailPublicId && existingCourse.thumbnailPublicId !== 'default_thumbnail_id') {
        await cloudinary.uploader.destroy(existingCourse.thumbnailPublicId).catch(() => {});
      }
      updateData.thumbnailPublicId = thumbnail.public_id;
      updateData.thumbnailSecureUrl = thumbnail.secure_url;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: { lectures: true, enrollments: true },
    });

    res.status(200).json({
      message: 'Course updated successfully',
      course: formatCourseResponse(updatedCourse),
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.thumbnailPublicId && course.thumbnailPublicId !== 'default_thumbnail_id') {
      await cloudinary.uploader.destroy(course.thumbnailPublicId).catch(() => {});
    }

    for (const lecture of course.lectures) {
      if (lecture.publicId) {
        await cloudinary.uploader.destroy(lecture.publicId, { resource_type: 'video' }).catch(() => {});
      }
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

const { uploadVideoToCloudinary, deleteCloudinaryAsset } = require('../utils/cloudinaryHelper');

const addLecture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Video file not uploaded' });
  }

  const filePath = req.file.path;

  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true, enrollments: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const result = await uploadVideoToCloudinary(filePath, 'lectures');
    const { secure_url, public_id } = result;

    await prisma.lecture.create({
      data: {
        courseId,
        title: title ? title.trim() : 'Untitled Lecture',
        description: description ? description.trim() : '',
        publicId: public_id,
        secureUrl: secure_url,
        orderIndex: course.lectures.length + 1,
      },
    });

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        numberOfLectures: course.lectures.length + 1,
      },
      include: {
        lectures: { orderBy: { orderIndex: 'asc' } },
        enrollments: true,
      },
    });

    res.status(201).json({
      message: 'Lecture added successfully',
      course: formatCourseResponse(updatedCourse),
    });
  } catch (err) {
    console.error('Error adding lecture:', err);
    res.status(500).json({ error: 'Failed to add lecture', details: err.message });
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

const viewEnrolledStudents = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    const students = enrollments.map((e) => ({
      _id: e.user.id,
      id: e.user.id,
      username: e.user.username,
      email: e.user.email,
    }));

    res.status(200).json({ students });
  } catch (err) {
    console.error('Error fetching enrolled students:', err);
    res.status(500).json({ error: 'Failed to fetch enrolled students' });
  }
};

const viewAvailableCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lectures: { orderBy: { orderIndex: 'asc' } },
        enrollments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCourses = courses.map(formatCourseResponse);
    res.status(200).json(formattedCourses || []);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const enrollInCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user?.id || req.user?._id;

  try {
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can enroll in courses' });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true, enrollments: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'User is already enrolled in this course' });
    }

    await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    // Create initial Progress record if none exists
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!existingProgress) {
      await prisma.progress.create({
        data: {
          userId,
          courseId,
          progressPercentage: 0,
          isCompleted: false,
        },
      });
    }

    const updatedCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true, enrollments: true },
    });

    res.status(200).json({
      message: 'Successfully enrolled in the course',
      course: formatCourseResponse(updatedCourse),
    });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ error: 'Failed to enroll in course', details: err.message });
  }
};

const viewEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lectures: { orderBy: { orderIndex: 'asc' } },
            enrollments: true,
          },
        },
      },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    const progressList = await prisma.progress.findMany({
      where: {
        userId,
        courseId: { in: courseIds },
      },
      include: {
        completedLectures: true,
      },
    });

    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.courseId] = p;
    });

    const enrichedEnrolledCourses = enrollments.map((e) => {
      const courseObj = formatCourseResponse(e.course);
      const prog = progressMap[e.courseId];

      const totalLectures = courseObj.lectures?.length || courseObj.numberOfLectures || 0;
      const completedLectureIds = (prog?.completedLectures || []).map((cl) => cl.lectureId);
      const completedCount = completedLectureIds.length;
      const progressPercentage =
        totalLectures > 0
          ? Math.min(100, Math.round((completedCount / totalLectures) * 100))
          : 0;

      return {
        ...courseObj,
        progress: {
          completedLectures: completedLectureIds,
          completedCount,
          totalLectures,
          progressPercentage,
          isCompleted: totalLectures > 0 && completedCount === totalLectures,
          lastWatchedLecture: prog?.lastWatchedLectureId || null,
          lastPlaybackTime: prog?.lastPlaybackTime || 0,
          updatedAt: prog?.updatedAt || courseObj.updatedAt,
        },
      };
    });

    res.status(200).json({ enrolledCourses: enrichedEnrolledCourses });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ error: 'Failed to retrieve enrolled courses', details: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
      include: {
        lectures: { orderBy: { orderIndex: 'asc' } },
        enrollments: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(formatCourseResponse(course));
  } catch (error) {
    console.error('Error getting course by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadThumbnail,
  createCourse,
  updateCourse,
  deleteCourse,
  addLecture,
  viewEnrolledStudents,
  viewAvailableCourses,
  enrollInCourse,
  viewEnrolledCourses,
  getCourseById,
};