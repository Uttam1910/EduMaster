import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../redux/slice/courseSlice';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { HiCloudArrowUp, HiBookOpen, HiTag, HiDocumentText, HiUser } from 'react-icons/hi2';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [createdBy, setCreatedBy] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      setCreatedBy(user.username);
    }
  }, [user]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      toast.error('Please upload a course thumbnail image.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('thumbnail', thumbnail);
    formData.append('createdBy', createdBy);

    try {
      await dispatch(createCourse(formData)).unwrap();
      toast.success('Course published successfully!');
      navigate('/courses');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <Badge variant="indigo" size="sm">Admin Management</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Create New Course</h1>
          <p className="text-slate-300 text-sm">Fill in course details, upload a thumbnail, and publish to students.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
              <HiBookOpen className="text-indigo-600" /> Course Title
            </label>
            <input
              type="text"
              placeholder="e.g. Master Modern Full-Stack Development"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
              <HiDocumentText className="text-indigo-600" /> Course Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the course curriculum, learning objectives, and prerequisite skills..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
              required
            />
          </div>

          {/* Category & CreatedBy Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
                <HiTag className="text-indigo-600" /> Category
              </label>
              <input
                type="text"
                placeholder="e.g. Web Development, AI & ML"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
                <HiUser className="text-indigo-600" /> Created By (Instructor)
              </label>
              <input
                type="text"
                value={createdBy}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium"
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
              <HiCloudArrowUp className="text-indigo-600 text-lg" /> Course Thumbnail Image
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer space-y-2 flex flex-col items-center">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-48 h-32 object-cover rounded-xl shadow-md"
                  />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                      <HiCloudArrowUp />
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">Click to upload image</span>
                    <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
            >
              Publish Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
