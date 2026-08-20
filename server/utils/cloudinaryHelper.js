const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const MAX_CLOUDINARY_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB Cloudinary Free Tier Limit

/**
 * Safely upload a video file to Cloudinary using chunked upload_large.
 * Prevents unhandled stream 'error' events and HTTP 413 / 400 Payload errors.
 */
const uploadVideoToCloudinary = (filePath, folder = 'lectures') => {
  return new Promise((resolve, reject) => {
    if (!filePath || !fs.existsSync(filePath)) {
      return reject(new Error('Video file does not exist on disk for upload.'));
    }

    // Check file size before initiating network upload to Cloudinary
    try {
      const stats = fs.statSync(filePath);
      if (stats.size > MAX_CLOUDINARY_VIDEO_SIZE) {
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
        return reject(
          new Error(
            `File size (${sizeMB} MB) exceeds Cloudinary's maximum limit of 100 MB per video on free accounts.`
          )
        );
      }
    } catch (e) {
      return reject(new Error('Failed to inspect video file size.'));
    }

    let settled = false;

    const handleReject = (err) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    };

    const handleResolve = (res) => {
      if (!settled) {
        settled = true;
        resolve(res);
      }
    };

    try {
      const uploadStream = cloudinary.uploader.upload_large(
        filePath,
        {
          resource_type: 'video',
          folder: folder,
          chunk_size: 6000000, // 6MB chunks
        },
        (error, result) => {
          if (error) {
            const errorMsg =
              error.message || error.error?.message || 'Cloudinary rejected video upload';
            return handleReject(new Error(errorMsg));
          }
          if (!result || !result.secure_url || !result.public_id) {
            return handleReject(new Error('Cloudinary failed to return secure_url or public_id'));
          }
          handleResolve(result);
        }
      );

      // Catch stream errors to prevent unhandled 'error' events on ReadStream
      if (uploadStream && typeof uploadStream.on === 'function') {
        uploadStream.on('error', (err) => {
          handleReject(err);
        });
      }
    } catch (err) {
      handleReject(err);
    }
  });
};

/**
 * Safely delete an asset from Cloudinary without throwing uncaught errors.
 */
const deleteCloudinaryAsset = async (publicId, resourceType = 'image') => {
  if (!publicId || publicId.startsWith('default_')) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err.message);
  }
};

module.exports = {
  uploadVideoToCloudinary,
  deleteCloudinaryAsset,
};
