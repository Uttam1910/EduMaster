import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { HiSparkles, HiAcademicCap, HiArrowRight, HiCheckBadge, HiPlay, HiRocketLaunch, HiLightBulb, HiGlobeAlt, HiShieldCheck } from 'react-icons/hi2';
import { FaGraduationCap, FaChalkboardTeacher, FaQuoteLeft } from 'react-icons/fa';
import albertImg from '../assets/Images/albert.jpg';
import marieeImg from '../assets/Images/mariee.jpeg';
import mahatmaImg from '../assets/Images/mahatma.jpeg';
import mandelaImg from '../assets/Images/Mandela.jpg';
import motherImg from '../assets/Images/mother.jpeg';
import jobsImg from '../assets/Images/jobs.jpeg';

const AboutUs = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const personalities = [
    {
      name: 'Albert Einstein',
      quote: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
      image: albertImg,
      role: 'Theoretical Physicist',
    },
    {
      name: 'Marie Curie',
      quote: 'Nothing in life is to be feared; it is only to be understood. Now is the time to understand more.',
      image: marieeImg,
      role: 'Nobel Laureate Physicist',
    },
    {
      name: 'Mahatma Gandhi',
      quote: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
      image: mahatmaImg,
      role: 'Leader & Visionary',
    },
    {
      name: 'Nelson Mandela',
      quote: 'Education is the most powerful weapon which you can use to change the world.',
      image: mandelaImg,
      role: 'Human Rights Champion',
    },
    {
      name: 'Mother Teresa',
      quote: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.',
      image: motherImg,
      role: 'Humanitarian',
    },
    {
      name: 'Steve Jobs',
      quote: 'The only way to do great work is to love what you do. Keep looking, don’t settle.',
      image: jobsImg,
      role: 'Tech Innovator',
    },
  ];

  const pillars = [
    {
      icon: HiRocketLaunch,
      title: 'Production-Ready Skills',
      desc: 'We design technical courses focused on real-world application, practical coding, and industry standards.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: HiLightBulb,
      title: 'Continuous Innovation',
      desc: 'Our platform evolves with modern standards to bring students the latest skills and tools.',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: HiGlobeAlt,
      title: 'Global Access',
      desc: 'Quality education accessible anywhere, anytime on desktop, mobile, or tablet.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: HiShieldCheck,
      title: 'Progressive Mastery',
      desc: 'Persisted learning progress tracking ensures learners pick up right where they left off.',
      color: 'bg-sky-50 text-sky-600',
    },
  ];

  const platformStats = [
    { value: '100%', label: 'Self-Paced Learning' },
    { value: 'HD', label: 'Video Quality' },
    { value: '24/7', label: 'Cloud Access' },
    { value: 'Real-Time', label: 'Progress Tracking' },
  ];

  return (
    <div className="space-y-20 pb-16 text-slate-900">
      {/* Top Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <HiSparkles className="text-indigo-400 text-sm" />
            <span>About EduMaster</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Empowering Lifelong <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400">Learners & Creators</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            EduMaster is built to bridge the gap between theoretical knowledge and production-ready technical skills. We believe quality education should be accessible, engaging, and persistent.
          </p>

          {/* Dynamic Action Buttons based on Auth State */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
                  icon={HiArrowRight}
                >
                  Join EduMaster Free
                </Button>
                <Button
                  variant="darkOutline"
                  size="lg"
                  onClick={() => navigate('/courses')}
                  className="w-full sm:w-auto"
                >
                  Explore Course Catalog
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
                  icon={HiArrowRight}
                >
                  Go to Student Dashboard
                </Button>
                <Button
                  variant="darkOutline"
                  size="lg"
                  onClick={() => navigate('/courses')}
                  className="w-full sm:w-auto"
                >
                  Browse All Courses
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Platform Impact Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {platformStats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{stat.value}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission & Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="indigo" size="sm">Core Pillars</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built on Principles of Excellence
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Our mission is to help learners cultivate mastery through structured curricula and intuitive tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <item.icon />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Inspirational Leaders Carousel */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="violet" size="sm">Words of Inspiration</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Wisdom from Great Minds
            </h2>
            <p className="text-slate-600 text-sm">Timeless perspectives that inspire our passion for learning.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
            <Carousel
              showArrows={true}
              autoPlay={true}
              infiniteLoop={true}
              interval={4500}
              showThumbs={false}
              showStatus={false}
            >
              {personalities.map((person, index) => (
                <div key={index} className="flex flex-col items-center py-4 px-2 space-y-4">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-md">
                      <FaQuoteLeft />
                    </div>
                  </div>

                  <div className="text-center space-y-2 max-w-lg">
                    <p className="text-base sm:text-lg italic font-medium text-slate-800 leading-relaxed">
                      "{person.quote}"
                    </p>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{person.name}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{person.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner (Adapts for Logged-In vs Logged-Out) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-3xl p-10 sm:p-16 text-white text-center sm:text-left relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {isLoggedIn ? `Welcome Back, ${user?.username || 'Learner'}!` : 'Start Your Learning Journey Today'}
            </h2>
            <p className="text-indigo-100 text-base leading-relaxed">
              {isLoggedIn
                ? 'Resume your courses or explore new technical topics in the catalog.'
                : 'Join thousands of students and gain hands-on technical skills with our structured courses.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="white"
                    size="lg"
                    onClick={() => navigate('/signup')}
                    icon={HiArrowRight}
                  >
                    Create Free Account
                  </Button>
                  <Button
                    variant="darkOutline"
                    size="lg"
                    onClick={() => navigate('/login')}
                  >
                    Sign In to Account
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="white"
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    icon={HiArrowRight}
                  >
                    Go to My Dashboard
                  </Button>
                  <Button
                    variant="darkOutline"
                    size="lg"
                    onClick={() => navigate('/courses')}
                  >
                    Browse Course Catalog
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
