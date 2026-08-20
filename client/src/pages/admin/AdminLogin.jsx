import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, logoutUser, logout } from '../../redux/slice/authSlice';
import { toast } from 'react-hot-toast';
import { HiShieldCheck, HiLockClosed, HiEnvelope, HiArrowRight, HiSparkles } from 'react-icons/hi2';
import Button from '../../components/ui/Button';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        const loggedUser = resultAction.payload.user;
        const role = resultAction.payload.role || loggedUser.role;

        if (role !== 'admin') {
          // Reject student trying to login through admin portal
          await dispatch(logoutUser());
          dispatch(logout());
          setErrorMessage('Access Denied: Student accounts cannot access the Admin Management Portal.');
          toast.error('Access Denied: Admin authorization required.');
          return;
        }

        toast.success(`Welcome back, ${loggedUser.username}!`);
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        const errorMsg = resultAction.payload?.message || resultAction.payload || 'Invalid email or password';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-indigo-600/30">
          <HiShieldCheck className="text-white" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <HiSparkles className="text-indigo-400" />
          <span>EduMaster Administration</span>
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal Sign In</h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Secure authentication for platform administrators and instructors.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold space-y-1">
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@edumaster.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full justify-center shadow-lg shadow-indigo-600/30"
              icon={HiArrowRight}
            >
              Sign In to Admin Workspace
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium"
            >
              Are you a student? Switch to Student Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
