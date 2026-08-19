const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const progressController = require('../controllers/progressController');
const { uploadThumbnail, createCourse, updateCourse, deleteCourse, addLecture } = courseController;
const { uploadThumbnail: multerUploadThumbnail, uploadVideo: multerUploadVideo } = require('../middleware/multer');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Endpoint for creating a course with a thumbnail
router.post(
  '/create',
  authMiddleware,
  adminMiddleware,
  multerUploadThumbnail.single('thumbnail'),
  uploadThumbnail,
  createCourse
);

// POST route to add a lecture to a course by courseId
router.post(
  '/:courseId/lectures',
  authMiddleware,
  adminMiddleware,
  multerUploadVideo.single('video'),
  addLecture
);

// Endpoint for updating a course
router.put(
  '/:courseId',
  authMiddleware,
  adminMiddleware,
  multerUploadThumbnail.single('thumbnail'),
  uploadThumbnail,
  updateCourse
);

// Route for deleting a course
router.delete(
  '/:courseId',
  authMiddleware,
  adminMiddleware,
  deleteCourse
);

// Route to get all available courses
router.get('/', courseController.viewAvailableCourses);

// Route to view enrolled courses
router.get('/enrolled', authMiddleware, roleMiddleware('student'), courseController.viewEnrolledCourses);

// View all students enrolled in a course
router.get('/:courseId/students', authMiddleware, adminMiddleware, courseController.viewEnrolledStudents);

// Enroll in a course
router.post('/:courseId/enroll', roleMiddleware('student'), courseController.enrollInCourse);

// --- Progress Tracking & Resume Learning Routes ---
// Get progress for a course
router.get('/:courseId/progress', authMiddleware, progressController.getCourseProgress);

// Toggle/set completion for a specific lecture
router.post(
  '/:courseId/lectures/:lectureId/complete',
  authMiddleware,
  progressController.toggleLectureCompletion
);

// Record last watched lecture position & playback time
router.post(
  '/:courseId/lectures/:lectureId/last-watched',
  authMiddleware,
  progressController.recordLastWatched
);

// Endpoint to get a course by ID
router.get('/:courseId', courseController.getCourseById);

module.exports = router;