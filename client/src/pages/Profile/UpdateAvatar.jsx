import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAvatar } from '../../redux/slice/authSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { HiCloudArrowUp, HiUser } from 'react-icons/hi2';

const UpdateAvatar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleAvatarUpload = () => {
    if (!avatarFile) {
      toast.error('Please select an image file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    dispatch(updateUserAvatar(formData))
      .unwrap()
      .then(() => {
        toast.success('Avatar updated successfully');
        navigate('/profile');
      })
      .catch((error) => {
        toast.error(typeof error === 'string' ? error : error?.message || 'Avatar update failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Update Profile Photo</h2>
          <p className="text-sm text-slate-500">Upload a new picture to personalize your account profile.</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500 shadow-xl"
              />
            ) : user?.avatar?.secureUrl ? (
              <img
                src={user.avatar.secureUrl}
                alt="Current Avatar"
                className="w-36 h-36 rounded-full object-cover border-4 border-slate-200 shadow-md"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center text-4xl text-slate-400">
                <HiUser />
              </div>
            )}
          </div>

          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-input"
            />
            <label
              htmlFor="avatar-input"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 transition"
            >
              <HiCloudArrowUp className="text-indigo-600 text-lg" />
              <span>Choose Image File</span>
            </label>
          </div>

          <div className="pt-2 flex gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/profile')}
              className="w-1/2 justify-center"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={loading}
              onClick={handleAvatarUpload}
              className="w-1/2 justify-center"
            >
              Upload Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvatar;
