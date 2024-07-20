import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/slice/authSlice';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaKey, FaImage } from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [error]);

  return (
    <div className="container mx-auto my-10 p-6 bg-white shadow-lg rounded-lg max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Profile</h1>
      {user ? (
        <div className="flex flex-col items-center">
          {user.avatar && user.avatar.secureUrl ? (
            <img
              src={user.avatar.secureUrl}
              alt="User Avatar"
              className="w-40 h-40 rounded-full mb-6 border-4 border-indigo-500 object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-full mb-6 border-4 border-indigo-500 flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
          <div className="text-center mb-8">
            <p className="text-2xl font-semibold text-gray-700 mb-2">Name: {user.username}</p>
            <p className="text-lg text-gray-600 mb-2">Email: {user.email}</p>
            <p className="text-md text-gray-500 mb-2">Role: {user.role}</p>
            <p className="text-md text-gray-500 mb-2">Active: {user.isActive ? 'Yes' : 'No'}</p>
            <p className="text-md text-gray-500 mb-2">
              Created At: {new Date(user.createdAt).toLocaleString()}
            </p>
            <p className="text-md text-gray-500 mb-2">
              Updated At: {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-6 mt-4">
            <Link
              to="/update-profile"
              className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </Link>
            <Link
              to="/changepassword"
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-700 flex items-center"
            >
              <FaKey className="mr-2" /> Change Password
            </Link>
            <button
              onClick={() => navigate('/update-avatar')}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <FaImage className="mr-2" /> Update Avatar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Profile;
