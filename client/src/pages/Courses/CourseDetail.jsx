import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCourseById, deleteCourse } from '../../redux/slice/courseSlice';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal.jsx';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import { HiPlay, HiCheckCircle, HiTrash, HiUserCircle, HiBookOpen, HiChevronRight, HiLockClosed } from 'react-icons/hi2';
import { FaUserGraduate } from 'react-icons/fa';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course, loading, error } = useSelector((state) => state.courses);
  const { user, role } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [activeLecture, setActiveLecture] = useState(null);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded-md w-1/4" />
        <div className="h-64 bg-slate-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-slate-200 rounded-md w-3/4" />
            <div className="h-32 bg-slate-200 rounded-2xl w-full" />
          </div>
          <div className="h-80 bg-slate-200 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Unable to Load Course Details"
          message={typeof error === 'string' ? error : error?.message || 'Course not found or database unavailable.'}
          onRetry={() => dispatch(fetchCourseById(courseId))}
        />
      </div>
    );
  }

  if (!course) return null;

  const isEnrolled = course.enrolledStudents?.includes(user?.id);
  const canAccessLectures = user && (role === 'admin' || isEnrolled);
  const lectures = course.lectures || [];
  const author = course.createdBy || 'EduMaster Instructor';
  const thumbnail = course.thumbnail?.secure_url || course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';

  const handleButtonClick = () => {
    if (!user) {
      toast.error('Please sign in or create an account to enroll');
      navigate('/signup');
    } else if (canAccessLectures) {
      if (lectures.length > 0) {
        setActiveLecture(lectures[0]);
      } else {
        toast.info('No video lectures published yet for this course.');
      }
    } else {
      toast.info('Please subscribe or enroll to access full lecture videos.');
    }
  };

  const confirmDeleteCourse = () => {
    dispatch(deleteCourse(course._id))
      .unwrap()
      .then(() => {
        toast.success('Course deleted successfully');
        navigate('/courses');
      })
      .catch((err) => {
        toast.error(`Failed to delete course: ${err.message || err}`);
      });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <HiChevronRight className="text-slate-400" />
        <Link to="/courses" className="hover:text-indigo-600">Courses</Link>
        <HiChevronRight className="text-slate-400" />
        <span className="text-slate-900 truncate max-w-[200px]">{course.title}</span>
      </nav>

      {/* Main Course Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Hero Information & Curriculum */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo" size="sm">{course.category || 'General'}</Badge>
              {canAccessLectures && <Badge variant="emerald" size="sm">Enrolled Access</Badge>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-600 text-base leading-relaxed">
              {course.description}
            </p>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <HiUserCircle className="text-slate-400 text-lg" />
                <span>Created by <strong className="text-slate-900">{author}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <HiBookOpen className="text-slate-400 text-lg" />
                <span>{lectures.length} {lectures.length === 1 ? 'Module' : 'Modules'}</span>
              </div>
            </div>
          </div>

          {/* Active Lecture Video Player Modal / Container (If accessible) */}
          {activeLecture && (
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-2xl border border-slate-800 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                  <HiPlay />
                  <span>Now Watching: {activeLecture.title}</span>
                </div>
                <button
                  onClick={() => setActiveLecture(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Close Player
                </button>
              </div>

              {activeLecture.lecture?.secure_url ? (
                <video
                  src={activeLecture.lecture.secure_url}
                  controls
                  autoPlay
                  className="w-full aspect-video rounded-2xl bg-black"
                />
              ) : (
                <div className="p-8 text-center bg-slate-800/60 rounded-2xl space-y-2">
                  <p className="font-semibold text-slate-200">{activeLecture.title}</p>
                  <p className="text-xs text-slate-400">{activeLecture.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Course Curriculum & Modules */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Course Curriculum</h2>
              <span className="text-xs font-semibold text-slate-500">{lectures.length} Lessons</span>
            </div>

            {lectures.length > 0 ? (
              <div className="space-y-3">
                {lectures.map((lecture, index) => (
                  <div
                    key={index}
                    onClick={() => canAccessLectures && setActiveLecture(lecture)}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                      canAccessLectures
                        ? 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer'
                        : 'border-slate-100 bg-slate-50/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        canAccessLectures ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{lecture.title}</h4>
                        {lecture.description && (
                          <p className="text-xs text-slate-500 line-clamp-1">{lecture.description}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      {canAccessLectures ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                          <HiPlay /> Play
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                          <HiLockClosed /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-sm">
                No lectures have been published yet for this course.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Action Card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden p-6 space-y-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
                <span>Access Type</span>
                <span className="text-indigo-600 font-bold">Full Lifetime Access</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleButtonClick}
                className="w-full justify-center shadow-lg shadow-indigo-600/30"
              >
                {user ? (
                  canAccessLectures ? (
                    <>
                      <HiPlay className="text-xl" />
                      <span>Start Learning Now</span>
                    </>
                  ) : (
                    <>
                      <FaUserGraduate />
                      <span>Enroll in Course</span>
                    </>
                  )
                ) : (
                  <span>Sign up to View Lectures</span>
                )}
              </Button>

              {role === 'admin' && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setShowModal(true)}
                  className="w-full justify-center"
                  icon={HiTrash}
                >
                  Delete Course
                </Button>
              )}
            </div>

            <div className="pt-2 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <HiCheckCircle className="text-emerald-500 text-base" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheckCircle className="text-emerald-500 text-base" />
                <span>Certificate of Completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeleteCourse}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action will remove all lectures and cannot be undone."
      />
    </div>
  );
};

export default CourseDetail;
