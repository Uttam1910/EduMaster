import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import {
  HiBookOpen,
  HiUsers,
  HiAcademicCap,
  HiPlay,
  HiPlusCircle,
  HiArrowRight,
  HiSparkles,
  HiCheckCircle,
  HiClock,
} from 'react-icons/hi2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-slate-800/60 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-slate-800/60 rounded-2xl" />
          <div className="h-64 bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState
          title="Unable to Load Admin Metrics"
          message={error}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    totalLectures: 0,
  };

  const recentCourses = data?.recentCourses || [];
  const recentStudents = data?.recentStudents || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <HiSparkles className="text-indigo-400" />
              <span>Real-Time Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Workspace Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Monitor catalog expansion, student enrollments, video lecture uploads, and user metrics directly from PostgreSQL.
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
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Courses</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl">
              <HiBookOpen />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalCourses}</p>
          <p className="text-[11px] text-slate-500">Active catalog offerings</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center text-xl">
              <HiUsers />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalStudents}</p>
          <p className="text-[11px] text-slate-500">Registered platform learners</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
              <HiAcademicCap />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalEnrollments}</p>
          <p className="text-[11px] text-slate-500">Student course subscriptions</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Lectures</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-xl">
              <HiPlay />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalLectures}</p>
          <p className="text-[11px] text-slate-500">Published Cloudinary video modules</p>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses Activity Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Catalog Courses</h3>
              <p className="text-xs text-slate-400">Latest published modules</p>
            </div>
            <Link to="/admin/courses" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>View All</span> <HiArrowRight />
            </Link>
          </div>

          {recentCourses.length > 0 ? (
            <div className="space-y-3">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                      alt={course.title}
                      className="w-12 h-10 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                    />
                    <div className="truncate space-y-0.5">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                        {course.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {course.category} • {course.numberOfLectures} lessons • {course.enrolledCount} enrolled
                      </p>
                    </div>
                  </div>
                  <Badge variant="indigo" size="xs">
                    View
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl text-slate-500 text-xs">
              No courses created yet. Click "Create New Course" to add one.
            </div>
          )}
        </div>

        {/* Recent Students Table Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Student Registrations</h3>
              <p className="text-xs text-slate-400">Latest platform accounts</p>
            </div>
            <Link to="/admin/users" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>Manage Users</span> <HiArrowRight />
            </Link>
          </div>

          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={st.avatarSecureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
                      alt={st.username}
                      className="w-9 h-9 rounded-full object-cover border border-slate-800 flex-shrink-0"
                    />
                    <div className="truncate space-y-0.5">
                      <p className="text-xs font-bold text-slate-200 truncate">{st.username}</p>
                      <p className="text-[11px] text-slate-500 truncate">{st.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <Badge variant={st.isActive ? 'emerald' : 'rose'} size="xs">
                      {st.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                    <p className="text-[10px] text-slate-500">
                      {new Date(st.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl text-slate-500 text-xs">
              No students registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
