import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axiosInstance from '../helpers/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi2';

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/users/changepassword', data);
      toast.success(response.data.message || 'Password changed successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed. Please verify current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Change Password</h2>
          <p className="text-sm text-slate-500">Update your security credentials for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Current Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('currentPassword', { required: 'Current password is required' })}
                type={showCurrent ? 'text' : 'password'}
                id="currentPassword"
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && <span className="text-rose-500 text-xs font-medium">{errors.currentPassword.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('newPassword', { required: 'New password is required' })}
                type={showNew ? 'text' : 'password'}
                id="newPassword"
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && <span className="text-rose-500 text-xs font-medium">{errors.newPassword.message}</span>}
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/profile')}
              className="w-1/2 justify-center"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-1/2 justify-center"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
