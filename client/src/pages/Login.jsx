import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginUser } from '../redux/slice/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiAcademicCap, HiSparkles, HiCheckCircle, HiArrowRight, HiShieldCheck } from 'react-icons/hi2';
import Button from '../components/ui/Button';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success(
        result.user?.role === 'admin'
          ? 'Welcome back, Admin!'
          : 'Login successful! Welcome back.'
      );
      navigate('/dashboard');
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || 'Login failed. Please verify email and password.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-900 relative overflow-hidden">
      {/* Background Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        {/* Left Side: Brand Showcase & Value Proposition */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 text-white flex flex-col justify-between space-y-8 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <HiAcademicCap className="text-3xl" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                EduMaster
              </span>
            </Link>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <HiSparkles className="text-indigo-400" />
                <span>Next-Gen LMS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Accelerate Your Career with Structured Learning
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Sign in to access your video lectures, persisted progress, and active dashboard.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <HiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                <span>Self-Paced Course Modules</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                <span>Automatic Real-Time Progress Tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                <span>24/7 Secure Cloud Access</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><HiShieldCheck className="text-indigo-400 text-sm" /> Encrypted Session</span>
            <span>EduMaster SaaS v2.0</span>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="p-8 sm:p-10 bg-white flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-500">Enter your credentials to access your account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  {...register('email', { required: 'Email address is required' })}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="text-rose-500 text-xs font-medium">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="text-rose-500 text-xs font-medium">{errors.password.message}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full justify-center shadow-lg shadow-indigo-600/25 mt-2"
              icon={HiArrowRight}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Footer Toggle */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Don't have an account?</span>{' '}
            <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
