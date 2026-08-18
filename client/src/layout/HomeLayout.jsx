import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaBook, FaPlusCircle, FaCompass, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import { HiAcademicCap, HiChevronDown } from 'react-icons/hi2';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, logout } from '../redux/slice/authSlice';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isLoggedIn, role, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    setIsSidebarOpen(false);
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `text-base font-medium px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Brand & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <FaBars className="text-xl" />
            </button>

            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <HiAcademicCap className="text-2xl" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                EduMaster
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              Courses
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </NavLink>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  {user?.avatar?.secureUrl ? (
                    <img
                      src={user.avatar.secureUrl}
                      alt={user.username || 'User'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline-block text-sm font-semibold text-slate-800 max-w-[120px] truncate">
                    {user?.username || 'Account'}
                  </span>
                  <HiChevronDown className="text-slate-400 text-xs hidden sm:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.username}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      {role && (
                        <div className="mt-1.5">
                          <Badge variant={role === 'admin' ? 'rose' : 'indigo'} size="xs">
                            {role}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        <FaUserCircle className="text-slate-400" />
                        My Profile
                      </NavLink>
                      {role === 'admin' && (
                        <NavLink
                          to="/create-course"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <FaPlusCircle className="text-slate-400" />
                          Create Course
                        </NavLink>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <FaSignOutAlt />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 bg-slate-900 text-white h-full z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <HiAcademicCap className="text-xl" />
              </div>
              <span className="font-extrabold text-lg text-white">EduMaster</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="p-4 space-y-1.5">
            <NavLink to="/" className={mobileNavLinkClass}>
              <FaCompass /> Home
            </NavLink>
            <NavLink to="/courses" className={mobileNavLinkClass}>
              <FaBook /> All Courses
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass}>
              <FaInfoCircle /> About Us
            </NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass}>
              <FaEnvelope /> Contact
            </NavLink>

            {isLoggedIn && (
              <>
                <div className="pt-4 pb-1 border-t border-slate-800">
                  <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Account
                  </span>
                </div>
                <NavLink to="/profile" className={mobileNavLinkClass}>
                  <FaUserCircle /> My Profile
                </NavLink>
                {role === 'admin' && (
                  <NavLink to="/create-course" className={mobileNavLinkClass}>
                    <FaPlusCircle /> Create Course
                  </NavLink>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800">
          {!isLoggedIn ? (
            <div className="space-y-2">
              <NavLink
                to="/login"
                className="w-full block text-center py-2.5 rounded-xl font-semibold bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="w-full block text-center py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30"
              >
                Get Started
              </NavLink>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Page Canvas */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
