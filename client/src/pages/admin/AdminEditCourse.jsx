import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import {
  HiBookOpen,
  HiPhoto,
  HiArrowLeft,
  HiPencilSquare,
  HiArrowRight,
} from 'react-icons/hi2';

const CATEGORIES = [
  'Web Development',
  'Data Science',
  'DevOps & Cloud',
  'Mobile Development',
  'Cybersecurity',
  'Artificial Intelligence',
  'Database Management',
  'General',
];

const AdminEditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    createdBy: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/admin/courses/${courseId}`);
      const course = response.data.course;
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || 'Web Development',
        createdBy: course.createdBy || '',
      });

      const existingThumbnail = course.thumbnail?.secure_url || course.thumbnailSecureUrl;
      if (existingThumbnail && !existingThumbnail.includes('default_thumbnail')) {
        setThumbnailPreview(existingThumbnail);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || formData.title.length < 5) {
      toast.error('Title must be at least 5 characters long.');
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (formData.createdBy) {
        data.append('createdBy', formData.createdBy);
      }
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }

      await axiosInstance.put(`/admin/courses/${courseId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Course updated successfully!');
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/4" />
        <div className="h-96 bg-slate-950/80 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorState title="Course Not Found" message={error} onRetry={fetchCourseData} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/courses')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <HiArrowLeft /> Back to Courses
        </button>
      </div>

      <div className="bg-slate-950/80 rounded-3xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl space-y-8">
        <div className="space-y-2 border-b border-slate-900 pb-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <HiPencilSquare />
            <span>Update Course Metadata</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Edit Course Details</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Modify course details or replace thumbnail image stored in Cloudinary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Category <span className="text-rose-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Instructor Name
            </label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Thumbnail Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Thumbnail Image
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-slate-500 text-xs">No image uploaded</div>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  id="thumbnail-input-edit"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail-input-edit"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition-all w-full text-center"
                >
                  <HiPhoto />
                  <span>{thumbnailFile ? 'Change Selected File' : 'Replace Thumbnail'}</span>
                </label>
                {thumbnailFile && (
                  <p className="text-[11px] text-indigo-400 font-semibold truncate">
                    New File: {thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-900 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/admin/courses')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              icon={HiArrowRight}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditCourse;
