import React from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsLinkedin, BsGithub } from 'react-icons/bs';
import { HiAcademicCap } from 'react-icons/hi2';
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
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <HiAcademicCap className="text-2xl" />
              </div>
              <span>EduMaster</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering learners worldwide with production-ready skills, expert guidance, and interactive courses.
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <p>Mumbai, Maharashtra, 400078</p>
              <p>Contact: r2464300@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">All Courses</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Platform / Account */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-indigo-400 transition-colors">Create Account</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/profile" className="hover:text-indigo-400 transition-colors">My Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="hover:text-indigo-400 transition-colors text-left">
                      Sign Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Legal & Social</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/terms-conditions" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refunds-cancellations" className="hover:text-indigo-400 transition-colors">Refund Policy</Link>
              </li>
            </ul>
            <div className="pt-4 flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200">
                <BsFacebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200">
                <BsInstagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200">
                <BsLinkedin size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200">
                <BsGithub size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} EduMaster Learning Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for modern education & skills training.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
