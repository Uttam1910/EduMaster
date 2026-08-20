// controllers/progressController.js
const prisma = require('../config/prismaClient');

/**
 * Toggle or set completion status for a specific lecture
 * POST /api/courses/:courseId/lectures/:lectureId/complete
 */
const toggleLectureCompletion = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 1. Verify Course Exists & Get Lectures
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Verify User Enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'You must be enrolled in this course to record completion progress.',
      });
    }

    // 3. Verify Lecture Belongs to Course
    const targetLecture = course.lectures.find((l) => l.id === lectureId);

    if (!targetLecture) {
      return res.status(404).json({
        message: 'The specified lecture does not belong to this course.',
      });
    }

    // 4. Find or Create Progress Document
    let progress = await prisma.progress.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
      include: {
        completedLectures: true,
      },
    });

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId,
          courseId,
          progressPercentage: 0,
          isCompleted: false,
        },
        include: {
          completedLectures: true,
        },
      });
    }

    // 5. Check existing completion status in junction table
    const existingCompletion = progress.completedLectures.find(
      (cl) => cl.lectureId === lectureId
    );

    const { markComplete, lastPlaybackTime } = req.body;

    let shouldComplete = false;
    if (markComplete === true) {
      shouldComplete = true;
    } else if (markComplete === false) {
      shouldComplete = false;
    } else {
      // Toggle state
      shouldComplete = !existingCompletion;
    }

    if (shouldComplete && !existingCompletion) {
      await prisma.lectureCompletion.create({
        data: {
          progressId: progress.id,
          lectureId,
        },
      });
    } else if (!shouldComplete && existingCompletion) {
      await prisma.lectureCompletion.delete({
        where: {
          id: existingCompletion.id,
        },
      });
    }

    // Fetch updated completion list
    const updatedCompletions = await prisma.lectureCompletion.findMany({
      where: { progressId: progress.id },
    });

    const validLectureIds = new Set(course.lectures.map((l) => l.id));
    const validCompletedIds = updatedCompletions
      .map((cl) => cl.lectureId)
      .filter((id) => validLectureIds.has(id));

    const totalLectures = course.lectures.length;
    const completedCount = validCompletedIds.length;

    let progressPercentage = 0;
    let isCompleted = false;

    if (totalLectures > 0) {
      progressPercentage = Math.min(100, Math.round((completedCount / totalLectures) * 100));
      isCompleted = completedCount === totalLectures;
    }

    const updateData = {
      lastWatchedLectureId: targetLecture.id,
      progressPercentage,
      isCompleted,
      completedAt: isCompleted ? progress.completedAt || new Date() : null,
    };

    if (typeof lastPlaybackTime === 'number' && lastPlaybackTime >= 0) {
      updateData.lastPlaybackTime = Math.floor(lastPlaybackTime);
    }

    const finalProgress = await prisma.progress.update({
      where: { id: progress.id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Progress updated successfully',
      progress: {
        courseId: course.id,
        completedLectures: validCompletedIds,
        completedCount,
        totalLectures,
        progressPercentage,
        isCompleted,
        lastWatchedLecture: finalProgress.lastWatchedLectureId,
        lastPlaybackTime: finalProgress.lastPlaybackTime,
      },
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({
      message: 'Failed to update course progress',
      error: error.message,
    });
  }
};

/**
 * Record last watched lecture position & optional playback timestamp
 * POST /api/courses/:courseId/lectures/:lectureId/last-watched
 */
const recordLastWatched = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { lastPlaybackTime } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Must be enrolled to record last watched position.',
      });
    }

    const targetLecture = course.lectures.find((l) => l.id === lectureId);

    if (!targetLecture) {
      return res.status(404).json({
        message: 'Specified lecture does not belong to this course.',
      });
    }

    const lastPlayback = typeof lastPlaybackTime === 'number' && lastPlaybackTime >= 0
      ? Math.floor(lastPlaybackTime)
      : 0;

    const progress = await prisma.progress.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: {
        lastWatchedLectureId: targetLecture.id,
        lastPlaybackTime: lastPlayback,
      },
      create: {
        userId,
        courseId,
        lastWatchedLectureId: targetLecture.id,
        lastPlaybackTime: lastPlayback,
        progressPercentage: 0,
        isCompleted: false,
      },
    });

    return res.status(200).json({
      message: 'Last watched lecture updated successfully',
      progress: {
        courseId: course.id,
        lastWatchedLecture: progress.lastWatchedLectureId,
        lastPlaybackTime: progress.lastPlaybackTime,
        updatedAt: progress.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error recording last watched lecture:', error);
    return res.status(500).json({
      message: 'Failed to record last watched lecture',
      error: error.message,
    });
  }
};

/**
 * Retrieve learning progress for a specific course
 * GET /api/courses/:courseId/progress
 */
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    const isEnrolled = !!enrollment || req.user.role === 'admin';

    if (!isEnrolled) {
      return res.status(200).json({
        progress: {
          courseId: course.id,
          completedLectures: [],
          completedCount: 0,
          totalLectures: course.lectures.length,
          progressPercentage: 0,
          isCompleted: false,
          isEnrolled: false,
          lastWatchedLecture: null,
          lastPlaybackTime: 0,
        },
      });
    }

    const progress = await prisma.progress.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
      include: {
        completedLectures: true,
      },
    });

    if (!progress) {
      return res.status(200).json({
        progress: {
          courseId: course.id,
          completedLectures: [],
          completedCount: 0,
          totalLectures: course.lectures.length,
          progressPercentage: 0,
          isCompleted: false,
          isEnrolled: true,
          lastWatchedLecture: null,
          lastPlaybackTime: 0,
        },
      });
    }

    const validCourseLectureIds = new Set(course.lectures.map((l) => l.id));
    const validCompleted = progress.completedLectures
      .map((cl) => cl.lectureId)
      .filter((id) => validCourseLectureIds.has(id));

    const totalLectures = course.lectures.length;
    const completedCount = validCompleted.length;
    const progressPercentage =
      totalLectures > 0
        ? Math.min(100, Math.round((completedCount / totalLectures) * 100))
        : 0;

    return res.status(200).json({
      progress: {
        courseId: course.id,
        completedLectures: validCompleted,
        completedCount,
        totalLectures,
        progressPercentage,
        isCompleted: totalLectures > 0 && completedCount === totalLectures,
        lastWatchedLecture: progress.lastWatchedLectureId,
        lastPlaybackTime: progress.lastPlaybackTime || 0,
        isEnrolled: true,
        updatedAt: progress.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return res.status(500).json({
      message: 'Failed to retrieve course progress',
      error: error.message,
    });
  }
};

module.exports = {
  toggleLectureCompletion,
  recordLastWatched,
  getCourseProgress,
};
