import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, logout } from '../redux/slice/authSlice';
import {
  HiSquares2X2,
  HiBookOpen,
  HiPlusCircle,
  HiUsers,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiGlobeAlt,
  HiSparkles,
  HiChevronRight,
} from 'react-icons/hi2';
import Badge from '../components/ui/Badge';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: HiSquares2X2,
    },
    {
      label: 'All Courses',
      path: '/admin/courses',
      icon: HiBookOpen,
    },
    {
      label: 'Create Course',
      path: '/admin/courses/create',
      icon: HiPlusCircle,
    },
    {
      label: 'User Management',
      path: '/admin/users',
      icon: HiUsers,
    },
  ];

  const avatarUrl =
    user?.avatar?.secureUrl ||
    user?.avatarSecureUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-white text-sm">
            E
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">EduMaster Admin</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
        >
          {mobileMenuOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo & Branding */}
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-600/30">
                E
              </div>
              <div>
                <h1 className="font-black text-lg text-white tracking-tight leading-none">EduMaster</h1>
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Admin Workspace</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`text-base ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-900 mt-4 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Student App</p>
              <Link
                to="/courses"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all"
              >
                <HiGlobeAlt className="text-base text-slate-400" />
                <span>View Student Portal</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 border-t border-slate-900 space-y-3 bg-slate-950/60">
          <div className="flex items-center gap-3 px-2">
            <img
              src={avatarUrl}
              alt={user?.username || 'Admin'}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.username || 'EduMaster Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@edumaster.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-rose-500/20"
          >
            <HiArrowRightOnRectangle className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Top Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-950/40 border-b border-slate-800/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Admin Control Panel</span>
            <HiChevronRight className="text-slate-600" />
            <span className="text-slate-200 font-semibold capitalize">
              {location.pathname.split('/')[2] || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="indigo" size="xs" className="gap-1">
              <HiSparkles className="text-indigo-400" />
              <span>Admin Privileges Active</span>
            </Badge>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <img
                src={avatarUrl}
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="text-xs font-bold text-slate-200">{user?.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
