import React from 'react';
import { BsFacebook, BsInstagram, BsLinkedin, BsGithub } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, logout } from '../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/');
  };

  return (
    <footer className="bg-gray-800 text-white py-12 mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div className="space-y-4 px-4 md:px-8">
          <h3 className="text-2xl font-bold mb-4">EduMaster</h3>
          <p className="text-sm">Gao Devi Road</p>
          <p className="text-sm">Mumbai, Maharashtra, 400078</p>
          <p className="text-sm">Email: r2464300@gmail.com</p>
          <p className="text-sm">Phone: (91) 7303896794</p>
        </div>

        {/* Quick Links and Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 md:px-8">
          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-gray-400 text-sm transition-colors">Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-400 text-sm transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-400 text-sm transition-colors">Contact</a>
              </li>
              <li>
                <a href="/courses" className="hover:text-gray-400 text-sm transition-colors">Courses</a>
              </li>
              {!isLoggedIn && (
                <>
                  <li>
                    <a href="/login" className="hover:text-gray-400 text-sm transition-colors">Login</a>
                  </li>
                  <li>
                    <a href="/signup" className="hover:text-gray-400 text-sm transition-colors">Sign Up</a>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <li>
                  <button onClick={handleLogout} className="hover:text-gray-400 text-sm transition-colors">Logout</button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms-conditions" className="hover:text-gray-400 text-sm transition-colors">Terms and Conditions</a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-gray-400 text-sm transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="/refunds-cancellations" className="hover:text-gray-400 text-sm transition-colors">Refunds and Cancellations</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center space-y-4 px-4 md:px-8">
          <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <BsFacebook size={24} className="hover:text-gray-400 transition-colors" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <BsInstagram size={24} className="hover:text-gray-400 transition-colors" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <BsLinkedin size={24} className="hover:text-gray-400 transition-colors" />
            </a>
            <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
              <BsGithub size={24} className="hover:text-gray-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700 pt-4">
        <p className="text-center text-sm">&copy; {new Date().getFullYear()} EduMaster. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
