import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal.jsx';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import {
  HiMagnifyingGlass,
  HiPlusCircle,
  HiPencilSquare,
  HiTrash,
  HiPlay,
  HiEye,
  HiUsers,
  HiBookOpen,
  HiXMark,
} from 'react-icons/hi2';

const AdminCourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Deletion modal state
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/courses');
      setCourses(response.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch admin courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return ['All'];
    const unique = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleDeleteCourse = async () => {
    if (!deleteCourseId) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/courses/${deleteCourseId}`);
      toast.success('Course and associated Cloudinary assets deleted successfully');
      setCourses((prev) => prev.filter((c) => c.id !== deleteCourseId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
      setDeleteCourseId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Course Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Create, edit, manage video lectures, and monitor student enrollment across all catalog courses.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/admin/courses/create')}
          icon={HiPlusCircle}
          className="shadow-lg shadow-indigo-600/20 whitespace-nowrap"
        >
          Create New Course
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-6 border border-slate-800/80 space-y-4">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
          <input
            type="text"
            placeholder="Search by title, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
            >
              <HiXMark className="text-lg" />
            </button>
          )}
        </div>

        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Course List Content Table */}
      {loading ? (
        <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800/80 animate-pulse space-y-4">
          <div className="h-10 bg-slate-900 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState title="Failed to Load Courses" message={error} onRetry={fetchCourses} />
      ) : filteredCourses.length > 0 ? (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Lectures</th>
                  <th className="py-4 px-4">Enrolled</th>
                  <th className="py-4 px-4">Instructor</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredCourses.map((course) => {
                  const thumbnailUrl =
                    course.thumbnail?.secure_url ||
                    course.thumbnailSecureUrl ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';

                  return (
                    <tr key={course.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <img
                            src={thumbnailUrl}
                            alt={course.title}
                            className="w-14 h-10 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                          />
                          <div className="space-y-0.5 truncate">
                            <p className="font-bold text-slate-100 text-xs truncate max-w-[200px]">
                              {course.title}
                            </p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{course.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant="indigo" size="xs">
                          {course.category}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-300">
                        <div className="flex items-center gap-1">
                          <HiPlay className="text-slate-500" />
                          <span>{course.numberOfLectures || course.lectures?.length || 0}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-300">
                        <div className="flex items-center gap-1">
                          <HiUsers className="text-slate-500" />
                          <span>{course.enrolledCount || 0}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-medium whitespace-nowrap">
                        {course.createdBy || 'EduMaster Admin'}
                      </td>

                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}`)}
                            title="View Course Info"
                            className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-400 transition-all"
                          >
                            <HiEye className="text-sm" />
                          </button>

                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                            title="Edit Course Details"
                            className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-400 transition-all"
                          >
                            <HiPencilSquare className="text-sm" />
                          </button>

                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}/lectures`)}
                            title="Manage Video Curriculum"
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold transition-all flex items-center gap-1 text-[11px]"
                          >
                            <HiPlay /> Manage Videos
                          </button>

                          <button
                            onClick={() => setDeleteCourseId(course.id)}
                            title="Delete Course"
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all"
                          >
                            <HiTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/80 rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center text-3xl mx-auto">
            <HiBookOpen />
          </div>
          <p className="text-slate-300 font-bold text-base">No courses match your criteria</p>
          <p className="text-slate-500 text-xs">Try clearing filters or create a new course.</p>
          <Button variant="primary" size="md" onClick={() => navigate('/admin/courses/create')}>
            Create New Course
          </Button>
        </div>
      )}

      {/* Confirmation Modal for Course Deletion */}
      <ConfirmationModal
        show={!!deleteCourseId}
        onClose={() => setDeleteCourseId(null)}
        onConfirm={handleDeleteCourse}
        title="Delete Course & Media Assets"
        message="Are you sure you want to delete this course? This action will permanently remove all associated video lectures from Cloudinary and wipe enrollment & progress records from PostgreSQL."
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        variant="danger"
      />
    </div>
  );
};

export default AdminCourseList;
