const Course = require('../models/course');
const Progress = require('../models/progress');

/**
 * Toggle or set completion status for a specific lecture
 * POST /api/courses/:courseId/lectures/:lectureId/complete
 */
const toggleLectureCompletion = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user.id || req.user._id;

    // 1. Verify Course Exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Verify User Enrollment
    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        message: 'You must be enrolled in this course to record completion progress.',
      });
    }

    // 3. Verify Lecture Belongs to Course
    const targetLecture = course.lectures.find(
      (l) => l._id.toString() === lectureId.toString()
    );

    if (!targetLecture) {
      return res.status(404).json({
        message: 'The specified lecture does not belong to this course.',
      });
    }

    // 4. Find or Initialize Progress Document
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        completedLectures: [],
      });
    }

    // 5. Toggle or Set Completion State
    const alreadyCompletedIndex = progress.completedLectures.findIndex(
      (id) => id.toString() === lectureId.toString()
    );

    const { markComplete, lastPlaybackTime } = req.body;

    if (markComplete === true) {
      if (alreadyCompletedIndex === -1) {
        progress.completedLectures.push(targetLecture._id);
      }
    } else if (markComplete === false) {
      if (alreadyCompletedIndex !== -1) {
        progress.completedLectures.splice(alreadyCompletedIndex, 1);
      }
    } else {
      // Toggle if no explicit boolean provided
      if (alreadyCompletedIndex !== -1) {
        progress.completedLectures.splice(alreadyCompletedIndex, 1);
      } else {
        progress.completedLectures.push(targetLecture._id);
      }
    }

    // 6. Filter Out Any Stale/Deleted Lecture IDs & Recalculate
    const validCourseLectureIds = new Set(
      course.lectures.map((l) => l._id.toString())
    );

    const validCompleted = progress.completedLectures.filter((id) =>
      validCourseLectureIds.has(id.toString())
    );

    progress.completedLectures = validCompleted;
    progress.lastWatchedLecture = targetLecture._id;
    if (typeof lastPlaybackTime === 'number' && lastPlaybackTime >= 0) {
      progress.lastPlaybackTime = lastPlaybackTime;
    }

    const totalLectures = course.lectures.length;
    const completedCount = validCompleted.length;

    if (totalLectures > 0) {
      progress.progressPercentage = Math.min(
        100,
        Math.round((completedCount / totalLectures) * 100)
      );
      progress.isCompleted = completedCount === totalLectures;
    } else {
      progress.progressPercentage = 0;
      progress.isCompleted = false;
    }

    if (progress.isCompleted) {
      progress.completedAt = progress.completedAt || new Date();
    } else {
      progress.completedAt = null;
    }

    await progress.save();

    return res.status(200).json({
      message: 'Progress updated successfully',
      progress: {
        courseId: course._id,
        completedLectures: progress.completedLectures,
        completedCount,
        totalLectures,
        progressPercentage: progress.progressPercentage,
        isCompleted: progress.isCompleted,
        lastWatchedLecture: progress.lastWatchedLecture,
        lastPlaybackTime: progress.lastPlaybackTime,
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
    const userId = req.user.id || req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        message: 'Must be enrolled to record last watched position.',
      });
    }

    const targetLecture = course.lectures.find(
      (l) => l._id.toString() === lectureId.toString()
    );

    if (!targetLecture) {
      return res.status(404).json({
        message: 'Specified lecture does not belong to this course.',
      });
    }

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        completedLectures: [],
      });
    }

    progress.lastWatchedLecture = targetLecture._id;
    if (typeof lastPlaybackTime === 'number' && lastPlaybackTime >= 0) {
      progress.lastPlaybackTime = Math.floor(lastPlaybackTime);
    }

    await progress.save();

    return res.status(200).json({
      message: 'Last watched lecture updated successfully',
      progress: {
        courseId: course._id,
        lastWatchedLecture: progress.lastWatchedLecture,
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
    const userId = req.user.id || req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isEnrolled) {
      return res.status(200).json({
        progress: {
          courseId: course._id,
          completedLectures: [],
          completedCount: 0,
          totalLectures: course.lectures?.length || 0,
          progressPercentage: 0,
          isCompleted: false,
          isEnrolled: false,
          lastWatchedLecture: null,
          lastPlaybackTime: 0,
        },
      });
    }

    const progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      return res.status(200).json({
        progress: {
          courseId: course._id,
          completedLectures: [],
          completedCount: 0,
          totalLectures: course.lectures?.length || 0,
          progressPercentage: 0,
          isCompleted: false,
          isEnrolled: true,
          lastWatchedLecture: null,
          lastPlaybackTime: 0,
        },
      });
    }

    const validCourseLectureIds = new Set(
      (course.lectures || []).map((l) => l._id.toString())
    );

    const validCompleted = (progress.completedLectures || []).filter((id) =>
      validCourseLectureIds.has(id.toString())
    );

    const totalLectures = course.lectures?.length || 0;
    const completedCount = validCompleted.length;
    const progressPercentage =
      totalLectures > 0
        ? Math.min(100, Math.round((completedCount / totalLectures) * 100))
        : 0;

    return res.status(200).json({
      progress: {
        courseId: course._id,
        completedLectures: validCompleted,
        completedCount,
        totalLectures,
        progressPercentage,
        isCompleted: totalLectures > 0 && completedCount === totalLectures,
        lastWatchedLecture: progress.lastWatchedLecture,
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
