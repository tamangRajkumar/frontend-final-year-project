import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiUsers, 
  HiSearch, 
  HiChevronLeft, 
  HiChevronRight,
  HiEye,
  HiMail,
  HiLocationMarker,
  HiCalendar,
  HiChat,
  HiLightningBolt,
  HiCode
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getUsersList, updateUserRole, createOrGetChat } from "../api";
import RoleGuard from "../../src/components/auth/RoleGuard";
import { getCleanToken, forceTokenCleanup } from "../../src/utils/tokenUtils";
import Image from "next/image";

const UsersList: NextPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    page: 1
  });

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    // Get clean token from Redux or localStorage
    const authToken = getCleanToken(token);
    
    console.log("Redux token:", token);
    console.log("Clean token:", authToken);
    
    if (authToken) {
      console.log("Using clean token for users API:", authToken);
      fetchUsers();
    } else {
      console.log("No valid token found, redirecting to login");
      router.push("/auth/login");
    }
  }, [token, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role })
      };

      // Use the clean token
      const authToken = getCleanToken(token);
      console.log("Using token for API call:", authToken);
      
      const { data } = await getUsersList(params, authToken);
      
      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.status === 401) {
        toast.error("Please login to access users list");
        router.push("/auth/login");
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };


  const handleRoleChange = (userId: string, newRole: string) => {
    const authToken = getCleanToken(token);
    updateUserRole(userId, newRole, authToken)
      .then(({ data }) => {
        if (data.success) {
          toast.success("User role updated successfully");
          fetchUsers();
        }
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
      });
  };

  const handleStartChat = async (userId: string) => {
    try {
      const authToken = getCleanToken(token);
      const { data } = await createOrGetChat(userId, authToken);
      if (data.success) {
        router.push(`/chat?chatId=${data.data._id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat");
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };


  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'business':
        return 'bg-orange-100 text-orange-800';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <RoleGuard allowedRoles={['admin', 'user', 'business']}>
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HiUsers className="h-8 w-8 mr-3 text-orange-600" />
                  {currentUser?.role === 'admin' ? 'Users Management' : 'Find Users'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {currentUser?.role === 'admin' 
                    ? 'Manage all users, roles, and permissions'
                    : 'Discover and connect with users'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Total Users: {pagination.totalUsers}
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={forceTokenCleanup}
                    className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Clear Storage & Reload
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Type</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-lg transition-colors flex items-center justify-center"
                style={{ backgroundColor: '#f26722' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a1f'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f26722'}
              >
                <HiSearch className="h-4 w-4 mr-2" />
                Search
              </button>
            </form>
          </div>

          {/* Users Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {users.map((user: any) => (
                <div key={user._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* User Avatar and Basic Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {user.userProfileImage?.url ? (
                          <Image
                            src={user.userProfileImage.url}
                            alt={user.fname}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.fname} {user.lname}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <HiMail className="h-4 w-4 mr-2" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <HiLocationMarker className="h-4 w-4 mr-2" />
                        {user.country}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <HiCalendar className="h-4 w-4 mr-2" />
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>

                    {/* Goals and Skills */}
                    {(user.goals?.length > 0 || user.skills?.length > 0) && (
                      <div className="mb-4 space-y-3">
                        {/* Goals */}
                        {user.goals?.length > 0 && (
                          <div>
                            <div className="flex items-center mb-2">
                              <HiLightningBolt className="h-4 w-4 mr-2 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-700">Goals</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.goals.slice(0, 3).map((goal: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                                >
                                  {goal}
                                </span>
                              ))}
                              {user.goals.length > 3 && (
                                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{user.goals.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {user.skills?.length > 0 && (
                          <div>
                            <div className="flex items-center mb-2">
                              <HiCode className="h-4 w-4 mr-2 text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">Skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.skills.slice(0, 3).map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {user.skills.length > 3 && (
                                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{user.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/users/${user._id}`)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                      >
                        <HiEye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      {currentUser && user._id !== currentUser._id && (
                        <button
                          onClick={() => handleStartChat(user._id)}
                          className="px-3 py-2 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                        >
                          <HiChat className="h-4 w-4 mr-1" />
                          Message
                        </button>
                      )}
                      {currentUser?.role === 'admin' && (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="user">User</option>
                          <option value="business">Business</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalUsers}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default UsersList;
