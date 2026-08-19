import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchEnrolledCourses } from '../redux/slice/courseSlice';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import CardSkeleton from '../components/ui/CardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { HiAcademicCap, HiArrowRight, HiPlay, HiCheckCircle, HiBookOpen, HiSparkles, HiClock } from 'react-icons/hi2';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { enrolledCourses, enrolledLoading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  const courses = enrolledCourses || [];
  const enrolledCount = courses.length;
  const completedCoursesCount = courses.filter((c) => c.progress?.isCompleted).length;
  const inProgressCount = enrolledCount - completedCoursesCount;

  // Identify the most relevant active course for "Continue Learning"
  // Priority: Most recently updated incomplete course, otherwise most recently updated course
  const sortedByRecent = [...courses].sort((a, b) => {
    const timeA = new Date(a.progress?.updatedAt || a.updatedAt).getTime();
    const timeB = new Date(b.progress?.updatedAt || b.updatedAt).getTime();
    return timeB - timeA;
  });

  const activeCourse = sortedByRecent.find((c) => !c.progress?.isCompleted) || sortedByRecent[0];

  const handleContinueLearning = (course) => {
    if (!course) return;
    navigate(`/courses/${course._id}`);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <HiSparkles className="text-indigo-400 text-sm" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400">{user?.username || 'Learner'}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Welcome back to your workspace. Pick up right where you left off or explore new learning modules.
          </p>

          {/* Real Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-white">{enrolledCount}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Enrolled Courses</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-emerald-400">{completedCoursesCount}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Completed</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-indigo-400">{inProgressCount}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      {enrolledLoading ? (
        <div className="space-y-8">
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        </div>
      ) : enrolledCount === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-4xl mx-auto shadow-sm">
            <HiAcademicCap />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Start Your Learning Journey</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              You haven't enrolled in any courses yet. Browse our catalog to discover technical training modules.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/courses')}
            className="shadow-lg shadow-indigo-600/25"
            icon={HiArrowRight}
          >
            Explore Course Catalog
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Continue Learning Hero Highlight Card */}
          {activeCourse && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200/80 shadow-md relative overflow-hidden space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                  <div className="relative aspect-video w-full sm:w-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img
                      src={activeCourse.thumbnail?.secure_url || activeCourse.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                      alt={activeCourse.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Badge variant="indigo" size="xs">
                        {activeCourse.category || 'General'}
                      </Badge>
                      {activeCourse.progress?.isCompleted && (
                        <Badge variant="emerald" size="xs">Completed ✓</Badge>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 line-clamp-1">
                      {activeCourse.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Instructor: <strong className="text-slate-800">{activeCourse.createdBy || 'EduMaster'}</strong>
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 justify-center sm:justify-start">
                      <HiClock /> Last Active: {activeCourse.progress?.updatedAt ? new Date(activeCourse.progress.updatedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-72 space-y-3 flex-shrink-0 text-center md:text-right">
                  <ProgressBar
                    value={activeCourse.progress?.progressPercentage || 0}
                    color={activeCourse.progress?.isCompleted ? 'emerald' : 'indigo'}
                    size="md"
                    showLabel
                  />
                  <p className="text-xs text-slate-500">
                    {activeCourse.progress?.completedCount || 0} of {activeCourse.progress?.totalLectures || activeCourse.lectures?.length || 0} modules completed
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleContinueLearning(activeCourse)}
                    className="w-full justify-center shadow-lg shadow-indigo-600/30"
                    icon={HiPlay}
                  >
                    {activeCourse.progress?.isCompleted ? 'Review Course' : 'Continue Learning'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Enrolled Courses Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Enrolled Courses</h2>
              <Link to="/courses" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <span>Browse All</span> <HiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const prog = course.progress || {};
                const isDone = prog.isCompleted;

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={course.thumbnail?.secure_url || course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant={isDone ? 'emerald' : 'indigo'} size="xs">
                            {isDone ? 'Completed ✓' : course.category || 'General'}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <ProgressBar
                        value={prog.progressPercentage || 0}
                        color={isDone ? 'emerald' : 'indigo'}
                        size="sm"
                        showLabel
                      />

                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>{prog.completedCount || 0} / {prog.totalLectures || course.lectures?.length || 0} Modules</span>
                        {isDone && <span className="text-emerald-600 font-bold flex items-center gap-1"><HiCheckCircle /> 100%</span>}
                      </div>

                      <Button
                        variant={isDone ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="w-full justify-center"
                      >
                        {isDone ? 'Review Modules' : 'Continue Course'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
