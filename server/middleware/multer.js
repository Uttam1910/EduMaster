const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir('uploads/avatars/');
ensureDir('uploads/thumbnails/');
ensureDir('uploads/lectures/');

// Configuration for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir('uploads/avatars/');
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const avatarFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'));
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: avatarFileFilter,
});

// Multer config for course thumbnails
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir('uploads/thumbnails/');
    cb(null, 'uploads/thumbnails/');
  },
  filename: (req, file, cb) => {
    cb(null, `thumb-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const thumbnailFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
  }
};

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: thumbnailFileFilter,
});

// Multer config for lecture videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir('uploads/lectures/');
    cb(null, 'uploads/lectures/');
  },
  filename: (req, file, cb) => {
    cb(null, `video-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const videoFileFilter = (req, file, cb) => {
  const filetypes = /mp4|mkv|mov|avi|webm|m4v|3gp|flv/;
  const mimetype = file.mimetype.startsWith('video/') || filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files (mp4, mkv, mov, avi, webm, m4v) are allowed!'));
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
  fileFilter: videoFileFilter,
});

module.exports = { uploadAvatar, uploadThumbnail, uploadVideo };
