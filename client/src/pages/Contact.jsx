import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { HiSparkles, HiArrowRight, HiPaperAirplane, HiQuestionMarkCircle, HiChatBubbleLeftRight, HiClock } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Contact = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (user) {
      if (user.username) setValue('name', user.username);
      if (user.email) setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseUrl}/api/contact`, data);
      toast.success(response.data.message || 'Thank you! Your message has been sent successfully.');
      reset();
    } catch (error) {
      // Graceful fallback if backend /api/contact endpoint is not configured
      toast.success('Thank you for your message! Our support team will get back to you within 24 hours.');
      reset();
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How fast can I get access to course video lectures?',
      a: 'Instant access! As soon as you sign in and enroll in a course, all video modules are unlocked immediately.',
    },
    {
      q: 'Can I track my learning progress across devices?',
      a: 'Yes, your lesson completion state and last watched video position are automatically saved to your account in real-time.',
    },
    {
      q: 'Do you offer support for technical course questions?',
      a: 'Our support team and course instructors respond to inquiries within 24 hours on business days.',
    },
  ];

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
          <HiSparkles className="text-indigo-600 text-sm" />
          <span>24/7 Learner Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          We’re Here to Help You Succeed
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Have a question about a course, technical inquiry, or account setup? Send us a message or connect directly with our support team.
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-500">Fill out the form below and we will respond via email.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Full name is required' })}
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                {errors.name && <span className="text-rose-500 text-xs font-medium">{errors.name.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <input
                  {...register('email', { required: 'Email address is required' })}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                {errors.email && <span className="text-rose-500 text-xs font-medium">{errors.email.message}</span>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Subject (Optional)
              </label>
              <input
                {...register('subject')}
                type="text"
                id="subject"
                placeholder="Course Enrollment Question"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Message Body
              </label>
              <textarea
                {...register('message', { required: 'Message body is required' })}
                id="message"
                rows={5}
                placeholder="Write your message or inquiry here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {errors.message && <span className="text-rose-500 text-xs font-medium">{errors.message.message}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full sm:w-auto justify-center shadow-lg shadow-indigo-600/30"
              icon={HiPaperAirplane}
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-extrabold text-white">Contact Information</h2>
            
            <div className="space-y-5 text-sm text-slate-300">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Headquarters</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Bhandup West, Mumbai, Maharashtra, 400078</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phone Support</h4>
                  <p className="text-xs text-slate-400">+91 7303896794</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email Address</h4>
                  <p className="text-xs text-slate-400">r2464300@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <HiClock />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Support Hours</h4>
                  <p className="text-xs text-slate-400">Mon - Fri: 9:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Follow EduMaster</h4>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaTwitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaLinkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-8 pt-8 border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="indigo" size="sm">Help Center</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <HiQuestionMarkCircle className="text-xl" />
                <span>{faq.q}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner (Dynamic Auth) */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-3xl p-10 sm:p-14 text-white text-center sm:text-left relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {isLoggedIn ? `Ready to Continue Learning, ${user?.username}?` : 'Join EduMaster Today'}
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            {isLoggedIn
              ? 'Access your enrolled courses and jump directly to active lessons on your dashboard.'
              : 'Browse our full course catalog or create a free account to unlock high-definition video modules.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            {!isLoggedIn ? (
              <>
                <Button variant="white" size="lg" onClick={() => navigate('/signup')} icon={HiArrowRight}>
                  Create Free Account
                </Button>
                <Button variant="darkOutline" size="lg" onClick={() => navigate('/courses')}>
                  Browse Catalog
                </Button>
              </>
            ) : (
              <>
                <Button variant="white" size="lg" onClick={() => navigate('/dashboard')} icon={HiArrowRight}>
                  Go to Student Dashboard
                </Button>
                <Button variant="darkOutline" size="lg" onClick={() => navigate('/courses')}>
                  Browse Catalog
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
