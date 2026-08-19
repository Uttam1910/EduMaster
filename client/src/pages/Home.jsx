import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import CardSkeleton from '../components/ui/CardSkeleton';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaChalkboardTeacher, FaLaptopCode, FaCertificate, FaUsers, FaMobileAlt, FaBookOpen } from 'react-icons/fa';
import { HiArrowRight, HiSparkles, HiAcademicCap, HiCheckBadge, HiPlay } from 'react-icons/hi2';
import { logoutUser, logout } from '../redux/slice/authSlice';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [popularCourses, setPopularCourses] = useState([]);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${baseUrl}/api/courses`);
        if (response.data && Array.isArray(response.data)) {
          setTotalCoursesCount(response.data.length);
          setPopularCourses(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching popular courses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/');
  };

  const learningSteps = [
    {
      step: '01',
      title: 'Discover & Enroll',
      description: 'Explore our catalog of structured courses and enroll in the subject of your choice.',
    },
    {
      step: '02',
      title: 'Learn & Practice',
      description: 'Watch video lectures, access lesson guides, and build practical exercises.',
    },
    {
      step: '03',
      title: 'Achieve & Advance',
      description: 'Track your completion progress and gain production-ready technical skills.',
    },
  ];

  const features = [
    {
      icon: FaChalkboardTeacher,
      title: 'Expert Instructors',
      description: 'Learn directly from industry leaders and developers with real-world experience.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: FaLaptopCode,
      title: 'Interactive Projects',
      description: 'Build real, production-ready applications through guided exercises and practical assignments.',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: FaCertificate,
      title: 'Recognized Credentials',
      description: 'Earn course completion recognition to boost your professional portfolio.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: FaUsers,
      title: 'Vibrant Community',
      description: 'Collaborate with fellow active learners and educators in a supportive ecosystem.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: FaMobileAlt,
      title: 'Flexible Learning',
      description: 'Access courses anytime, anywhere on desktop, tablet, or mobile devices.',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      icon: FaBookOpen,
      title: 'Extensive Library',
      description: 'Explore comprehensive guides, code repositories, and downloadable resources for every lesson.',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-28">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <HiSparkles className="text-indigo-400 text-sm" />
              <span>Next-Gen Online Education</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master New Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">EduMaster</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              Explore production-ready courses curated by industry professionals. Build real projects, track your progress, and advance your career today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
                  >
                    <span>Get Started Free</span>
                    <HiArrowRight className="text-lg" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/courses')}
                    className="w-full sm:w-auto bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    Browse Catalog
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/courses')}
                    className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
                  >
                    <span>Explore All Courses</span>
                    <HiArrowRight className="text-lg" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/profile')}
                    className="w-full sm:w-auto"
                  >
                    Go to Profile
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Real Dynamic Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white">{totalCoursesCount}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Catalog Courses</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Self-Paced Access</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white">HD</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Video Modules</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Platform Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="indigo" size="sm">Why Choose Us</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Learners
          </h2>
          <p className="text-slate-600 text-base">
            Everything you need to master technical skills and achieve your professional goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col space-y-4 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <feature.icon />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Popular Courses */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="violet" size="sm" className="mb-2">Top Programs</Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Courses</h2>
              <p className="text-slate-600 text-sm mt-1">Explore top-rated technical courses available in our catalog.</p>
            </div>
            <Button variant="outline" size="md" onClick={() => navigate('/courses')}>
              <span>View All Catalog</span>
              <HiArrowRight />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CardSkeleton count={3} />
            </div>
          ) : popularCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <p>No popular courses listed at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* How Learning Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="emerald" size="sm">Learning Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How EduMaster Works
          </h2>
          <p className="text-slate-600 text-base">
            Simple 3-step learning pathway to master any topic at your own speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {learningSteps.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-4 relative">
              <span className="text-4xl font-black text-indigo-100">{item.step}</span>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-3xl p-10 sm:p-16 text-white text-center sm:text-left relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-indigo-100 text-base leading-relaxed">
              Join our community of learners today. Get instant access to expert-led courses.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              {!isLoggedIn ? (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Create Free Account
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/courses')}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Browse Course Catalog
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
