import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal.jsx';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import ProgressBar from '../../components/ui/ProgressBar';
import {
  HiArrowLeft,
  HiPlay,
  HiPlusCircle,
  HiTrash,
  HiPencilSquare,
  HiXMark,
  HiVideoCamera,
  HiCheckCircle,
} from 'react-icons/hi2';

const AdminLectures = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Video Preview Player Modal State
  const [activePreviewLecture, setActivePreviewLecture] = useState(null);

  // Edit Modal State
  const [editingLecture, setEditingLecture] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  // Deletion Modal State
  const [deleteLectureId, setDeleteLectureId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/admin/courses/${courseId}`);
      setCourse(response.data.course);
      setLectures(response.data.course?.lectures || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load course curriculum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const MAX_CLOUDINARY_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB Cloudinary Free Tier Limit

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file (.mp4, .webm, .mov)');
        e.target.value = '';
        setVideoFile(null);
        return;
      }

      if (file.size > MAX_CLOUDINARY_VIDEO_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        toast.error(
          `Video size (${sizeMB} MB) exceeds Cloudinary's 100 MB limit. Please compress your video or choose a file under 100 MB.`,
          { duration: 6000 }
        );
        e.target.value = '';
        setVideoFile(null);
        return;
      }

      setVideoFile(file);
    }
  };

  const handleUploadLecture = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      toast.error('Lecture title is required.');
      return;
    }
    if (!videoFile) {
      toast.error('Please select a video file to upload.');
      return;
    }

    if (videoFile.size > MAX_CLOUDINARY_VIDEO_SIZE) {
      const sizeMB = (videoFile.size / (1024 * 1024)).toFixed(1);
      toast.error(`Video file size (${sizeMB} MB) exceeds Cloudinary's 100 MB limit.`);
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('title', uploadTitle.trim());
      formData.append('description', uploadDescription.trim());
      formData.append('video', videoFile);

      const response = await axiosInstance.post(`/admin/courses/${courseId}/lectures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      toast.success('🎉 Video uploaded & added to curriculum successfully!');
      const newLec = response.data.lecture;
      if (newLec) {
        setLectures((prev) => [...prev, newLec]);
      } else {
        fetchCourseData();
      }

      // Reset Modal Form
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadDescription('');
      setVideoFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error('Error uploading lecture:', err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to upload video lecture';
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleEditLecture = async (e) => {
    e.preventDefault();
    if (!editingLecture) return;

    setUpdating(true);
    try {
      const response = await axiosInstance.put(`/admin/lectures/${editingLecture.id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      toast.success('Lecture updated successfully!');
      setLectures((prev) =>
        prev.map((l) => (l.id === editingLecture.id ? { ...l, ...response.data.lecture } : l))
      );
      setEditingLecture(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lecture');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLecture = async () => {
    if (!deleteLectureId) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/lectures/${deleteLectureId}`);
      toast.success('Lecture and video asset deleted successfully from Cloudinary & PostgreSQL');
      setLectures((prev) => prev.filter((l) => l.id !== deleteLectureId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lecture');
    } finally {
      setDeleting(false);
      setDeleteLectureId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/4" />
        <div className="h-40 bg-slate-950/80 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-20 bg-slate-950/80 rounded-2xl" />
          <div className="h-20 bg-slate-950/80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState title="Course Not Found" message={error} onRetry={fetchCourseData} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/admin/courses/${courseId}`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <HiArrowLeft /> Back to Course Overview
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUploadModal(true)}
          icon={HiPlusCircle}
          className="shadow-lg shadow-indigo-600/30"
        >
          Add Video Lecture
        </Button>
      </div>

      {/* Course Context Header */}
      <div className="bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <HiVideoCamera />
            <span>Curriculum Video Manager</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{course?.title}</h1>
          <p className="text-xs text-slate-400">
            {lectures.length} Video Modules • Category: {course?.category}
          </p>
        </div>
      </div>

      {/* Active Video Preview Player Container */}
      {activePreviewLecture && (
        <div className="bg-slate-950 rounded-3xl p-6 text-white space-y-4 shadow-2xl border border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <HiPlay />
              <span>Previewing: {activePreviewLecture.title}</span>
            </div>
            <button
              onClick={() => setActivePreviewLecture(null)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Close Video Preview
            </button>
          </div>

          <video
            src={activePreviewLecture.lecture?.secure_url || activePreviewLecture.secure_url}
            controls
            autoPlay
            className="w-full aspect-video rounded-2xl bg-black shadow-inner"
          />
        </div>
      )}

      {/* Lecture List */}
      <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <h2 className="text-base font-bold text-white">Course Modules ({lectures.length})</h2>
          <span className="text-xs text-slate-500 font-medium">Cloudinary Video Storage</span>
        </div>

        {lectures.length > 0 ? (
          <div className="space-y-3">
            {lectures.map((lecture, index) => {
              const videoUrl = lecture.lecture?.secure_url || lecture.secure_url;

              return (
                <div
                  key={lecture.id || index}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-100 text-sm">{lecture.title}</h4>
                      {lecture.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">{lecture.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {videoUrl && (
                      <button
                        onClick={() => setActivePreviewLecture(lecture)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <HiPlay /> Preview Video
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingLecture(lecture);
                        setEditTitle(lecture.title);
                        setEditDescription(lecture.description || '');
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all text-xs"
                      title="Edit Title/Description"
                    >
                      <HiPencilSquare className="text-sm" />
                    </button>

                    <button
                      onClick={() => setDeleteLectureId(lecture.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all text-xs"
                      title="Delete Video Lecture"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center text-2xl mx-auto">
              <HiVideoCamera />
            </div>
            <p className="text-slate-300 font-bold text-sm">No video lectures uploaded yet</p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Add HD video lessons to publish this course curriculum for enrolled students.
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowUploadModal(true)}>
              Upload First Video Lecture
            </Button>
          </div>
        )}
      </div>

      {/* Upload Video Lecture Modal with Progress Bar */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-base">
                  <HiVideoCamera />
                </div>
                <h3 className="text-lg font-bold text-white">Upload Video Lecture</h3>
              </div>
              <button
                disabled={uploading}
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUploadLecture} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Lecture Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. 01. Introduction to Relational Databases"
                  required
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Lecture Summary (Optional)
                </label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief summary of key concepts covered..."
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Video File (.mp4, .webm) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    Max 100 MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  disabled={uploading}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Cloudinary Free Tier limit: Video files must be under 100 MB.
                </p>
              </div>

              {/* Upload Progress UX Bar */}
              {uploading && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-indigo-300 flex items-center gap-1.5">
                      <HiVideoCamera className="animate-pulse" /> Uploading to Cloudinary...
                    </span>
                    <span className="text-indigo-400 font-bold">{uploadProgress}%</span>
                  </div>
                  <ProgressBar value={uploadProgress} color="indigo" size="md" />
                  <p className="text-[11px] text-slate-400 text-center">
                    Please keep this window open while processing.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={uploading}
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={uploading}
                  icon={HiPlusCircle}
                >
                  Upload & Save Lecture
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lecture Modal */}
      {editingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Edit Lecture Metadata</h3>
              <button onClick={() => setEditingLecture(null)} className="text-slate-400 hover:text-white p-1">
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleEditLecture} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="md" onClick={() => setEditingLecture(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={updating}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={!!deleteLectureId}
        onClose={() => setDeleteLectureId(null)}
        onConfirm={handleDeleteLecture}
        title="Delete Video Lecture"
        message="Are you sure you want to delete this lecture? The video asset will be permanently removed from Cloudinary and database completion records will be updated."
        confirmText={deleting ? 'Deleting...' : 'Delete Video'}
        variant="danger"
      />
    </div>
  );
};

export default AdminLectures;
