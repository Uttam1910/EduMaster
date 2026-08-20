import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/slice/authSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaKey, FaCamera } from 'react-icons/fa';
import { HiUser, HiEnvelope, HiShieldCheck, HiCalendar, HiClock } from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error?.message || 'An error occurred fetching profile');
    }
  }, [error]);

  const avatarUrl = user?.avatar?.secureUrl || user?.avatar?.secure_url;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Container */}
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-28 h-28 rounded-full border-4 border-white/20 shadow-xl object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-white/20 shadow-xl bg-indigo-600 flex items-center justify-center font-bold text-3xl text-white">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <button
              onClick={() => navigate('/update-avatar')}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md focus:outline-none"
              title="Update Avatar"
            >
              <FaCamera className="text-xs" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user?.username || 'User Profile'}</h1>
              <Badge variant={user?.role === 'admin' ? 'rose' : 'indigo'} size="xs">
                {user?.role || 'student'}
              </Badge>
            </div>
            <p className="text-slate-300 text-sm">{user?.email}</p>
            <p className="text-xs text-slate-400">Account Status: <span className="text-emerald-400 font-semibold">Active</span></p>
          </div>
        </div>
      </div>

      {/* Main Profile Info Cards */}
      {user ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">User Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <HiUser className="text-indigo-600 text-lg" />
                <span>Username: <strong>{user.username}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <HiEnvelope className="text-indigo-600 text-lg" />
                <span>Email: <strong>{user.email}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <HiShieldCheck className="text-indigo-600 text-lg" />
                <span>Role: <strong>{user.role}</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Account Metadata</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <HiCalendar className="text-indigo-600 text-lg" />
                <span>Joined: <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <HiClock className="text-indigo-600 text-lg" />
                <span>Last Updated: <strong>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 animate-pulse">
          Loading profile details...
        </div>
      )}

      {/* Action Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap gap-4 justify-center sm:justify-start">
        <Button variant="primary" size="md" onClick={() => navigate('/update-profile')} icon={FaEdit}>
          Edit Profile
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate('/update-avatar')} icon={FaCamera}>
          Update Avatar
        </Button>
        <Button variant="danger" size="md" onClick={() => navigate('/changepassword')} icon={FaKey}>
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default Profile;
