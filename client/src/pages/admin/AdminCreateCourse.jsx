import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import {
  HiBookOpen,
  HiPhoto,
  HiArrowLeft,
  HiPlusCircle,
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

const AdminCreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    createdBy: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

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

    if (!formData.description || formData.description.length < 15) {
      toast.error('Description must be at least 15 characters long.');
      return;
    }

    setLoading(true);

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

      const response = await axiosInstance.post('/admin/courses', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('🎉 Course created successfully!');
      const newCourseId = response.data.course?.id || response.data.course?._id;
      if (newCourseId) {
        navigate(`/admin/courses/${newCourseId}/lectures`);
      } else {
        navigate('/admin/courses');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
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
            <HiBookOpen />
            <span>New Catalog Entry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create New Course</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Fill in course details and upload an attractive thumbnail image for student enrollment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Master Fullstack React & Node.js Development"
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
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

          {/* Instructor / Created By */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Instructor Name (Optional)
            </label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Leave blank for EduMaster Admin"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive summary of what students will learn in this course..."
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Thumbnail Image File Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Thumbnail Image (Cloudinary)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="space-y-2 text-slate-500">
                    <HiPhoto className="text-4xl mx-auto text-slate-600" />
                    <p className="text-xs font-medium">PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  id="thumbnail-input"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail-input"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition-all w-full text-center"
                >
                  <HiPhoto />
                  <span>{thumbnailFile ? 'Change Selected Image' : 'Select Image File'}</span>
                </label>
                {thumbnailFile && (
                  <p className="text-[11px] text-indigo-400 font-semibold truncate">
                    Selected: {thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/admin/courses')}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
              icon={HiArrowRight}
            >
              Save Course & Upload Videos →
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateCourse;
