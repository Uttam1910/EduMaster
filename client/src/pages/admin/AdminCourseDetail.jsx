import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal.jsx';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import {
  HiArrowLeft,
  HiPencilSquare,
  HiPlay,
  HiTrash,
  HiUsers,
  HiBookOpen,
  HiUserCircle,
  HiClock,
} from 'react-icons/hi2';

const AdminCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/admin/courses/${courseId}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load course detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleDeleteCourse = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/courses/${courseId}`);
      toast.success('Course deleted successfully');
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/4" />
        <div className="h-64 bg-slate-950/80 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-48 bg-slate-950/80 rounded-2xl" />
          <div className="h-48 bg-slate-950/80 rounded-2xl" />
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

  const course = data?.course;
  const enrolledStudents = data?.enrolledStudents || [];
  const lectures = course?.lectures || [];

  const thumbnailUrl =
    course?.thumbnail?.secure_url ||
    course?.thumbnailSecureUrl ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/courses')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <HiArrowLeft /> Back to Courses
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/courses/${courseId}/edit`)}
            icon={HiPencilSquare}
          >
            Edit Course
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/admin/courses/${courseId}/lectures`)}
            icon={HiPlay}
          >
            Manage Video Curriculum
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            icon={HiTrash}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Course Hero Banner */}
      <div className="bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl flex flex-col lg:flex-row gap-8 items-start">
        <div className="relative aspect-video w-full lg:w-96 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
          <img src={thumbnailUrl} alt={course?.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="indigo" size="sm">
              {course?.category}
            </Badge>
            <span className="text-xs text-slate-500 font-semibold">
              Created {new Date(course?.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {course?.title}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">{course?.description}</p>

          <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <HiUserCircle className="text-slate-500 text-base" />
              <span>
                Instructor: <strong className="text-slate-200">{course?.createdBy}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiBookOpen className="text-slate-500 text-base" />
              <span>{lectures.length} Video Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiUsers className="text-slate-500 text-base" />
              <span>{enrolledStudents.length} Students Enrolled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum & Enrolled Students Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Curriculum Card */}
        <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Course Curriculum</h3>
              <p className="text-xs text-slate-400">{lectures.length} Published Video Modules</p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate(`/admin/courses/${courseId}/lectures`)}
              icon={HiPlay}
            >
              Manage Curriculum
            </Button>
          </div>

          {lectures.length > 0 ? (
            <div className="space-y-3">
              {lectures.map((lec, idx) => (
                <div
                  key={lec.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{lec.title}</p>
                      {lec.description && <p className="text-[11px] text-slate-500">{lec.description}</p>}
                    </div>
                  </div>
                  <Badge variant="indigo" size="xs">
                    Video Ready
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl text-slate-500 text-xs">
              No lectures added yet. Click "Manage Curriculum" to upload videos.
            </div>
          )}
        </div>

        {/* Enrolled Students Card */}
        <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Enrolled Students</h3>
              <p className="text-xs text-slate-400">{enrolledStudents.length} Total Subscriptions</p>
            </div>
            <Link to="/admin/users" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All Users
            </Link>
          </div>

          {enrolledStudents.length > 0 ? (
            <div className="space-y-3">
              {enrolledStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200">{st.username}</p>
                    <p className="text-[11px] text-slate-500">{st.email}</p>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Enrolled {new Date(st.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl text-slate-500 text-xs">
              No students enrolled in this course yet.
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCourse}
        title="Delete Course & Media Assets"
        message="Are you sure you want to delete this course? This action will permanently remove all associated video lectures from Cloudinary and wipe enrollment & progress records from PostgreSQL."
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        variant="danger"
      />
    </div>
  );
};

export default AdminCourseDetail;
