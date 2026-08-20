// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { uploadThumbnail: multerUploadThumbnail, uploadVideo: multerUploadVideo } = require('../middleware/multer');

// Apply JWT authentication and Admin role check to ALL /api/admin/* routes
router.use(authMiddleware);
router.use(adminMiddleware);

// --- Admin Dashboard ---
router.get('/dashboard', adminController.getDashboardMetrics);

// --- Admin Course Management ---
router.get('/courses', adminController.getAdminCourses);
router.post('/courses', multerUploadThumbnail.single('thumbnail'), adminController.createAdminCourse);
router.get('/courses/:courseId', adminController.getAdminCourseById);
router.put('/courses/:courseId', multerUploadThumbnail.single('thumbnail'), adminController.updateAdminCourse);
router.delete('/courses/:courseId', adminController.deleteAdminCourse);

// --- Admin Lecture & Video Upload Management ---
router.post('/courses/:courseId/lectures', multerUploadVideo.single('video'), adminController.addAdminLecture);
router.put('/lectures/:lectureId', adminController.updateAdminLecture);
router.delete('/lectures/:lectureId', adminController.deleteAdminLecture);

// --- Admin User Management ---
router.get('/users', adminController.getAdminUsers);
router.put('/users/:userId/status', adminController.toggleUserStatus);

module.exports = router;
