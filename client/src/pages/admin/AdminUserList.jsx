import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import {
  HiUsers,
  HiMagnifyingGlass,
  HiShieldCheck,
  HiCheckCircle,
  HiXCircle,
  HiXMark,
} from 'react-icons/hi2';

const AdminUserList = () => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleToggleStatus = async (user) => {
    if (user.id === loggedInUser?.id && user.isActive) {
      toast.error('You cannot deactivate your own logged-in admin account.');
      return;
    }

    setTogglingId(user.id);
    const newStatus = !user.isActive;

    try {
      await axiosInstance.put(`/admin/users/${user.id}/status`, {
        isActive: newStatus,
      });

      toast.success(
        `User ${user.username} has been ${newStatus ? 'activated' : 'deactivated'}.`
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">User Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View student and admin accounts, enrollment counts, and manage platform access privileges.
          </p>
        </div>
      </div>

      {/* Search & Role Filter Toolbar */}
      <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-6 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
            <input
              type="text"
              placeholder="Search by username or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
              >
                <HiXMark className="text-lg" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['All', 'student', 'admin'].map((role) => {
              const isActive = roleFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800/80 animate-pulse space-y-4">
          <div className="h-10 bg-slate-900 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState title="Failed to Load Users" message={error} onRetry={fetchUsers} />
      ) : filteredUsers.length > 0 ? (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Enrolled Courses</th>
                  <th className="py-4 px-4">Joined Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredUsers.map((u) => {
                  const avatarUrl =
                    u.avatar?.secureUrl ||
                    u.avatarSecureUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';

                  return (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarUrl}
                            alt={u.username}
                            className="w-9 h-9 rounded-full object-cover border border-slate-800 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-100 text-xs">{u.username}</p>
                            {u.id === loggedInUser?.id && (
                              <span className="text-[10px] text-indigo-400 font-bold uppercase">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-300 font-medium">{u.email}</td>

                      <td className="py-4 px-4">
                        <Badge variant={u.role === 'admin' ? 'indigo' : 'slate'} size="xs">
                          {u.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-300">
                        {u.enrolledCount || 0} Courses
                      </td>

                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={u.isActive ? 'emerald' : 'rose'} size="xs">
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </Badge>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Button
                          variant={u.isActive ? 'darkOutline' : 'success'}
                          size="xs"
                          isLoading={togglingId === u.id}
                          disabled={u.id === loggedInUser?.id}
                          onClick={() => handleToggleStatus(u)}
                          icon={u.isActive ? HiXCircle : HiCheckCircle}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/80 rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center text-3xl mx-auto">
            <HiUsers />
          </div>
          <p className="text-slate-300 font-bold text-base">No users found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
