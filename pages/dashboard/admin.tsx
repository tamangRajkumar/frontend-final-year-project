import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Admin: NextPage = () => {
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalAdmins: 0,
    totalPosts: 0,
    totalLikes: 0,
    pendingVerifications: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user has admin role
  useEffect(() => {
    if (isClient && currentUser && currentUser.role !== "admin") {
      router.push("/dashboard/user");
      toast.error("Access denied. Admin privileges required.");
    }
  }, [currentUser, router, isClient]);

  useEffect(() => {
    if (isClient && currentUser?.role === "admin") {
      loadAdminData();
    }
  }, [currentUser, isClient]);

  const loadAdminData = async () => {
    // This would typically fetch data from your API
    // For now, we'll use mock data
    setAdminStats({
      totalUsers: 1250,
      totalBusinesses: 45,
      totalAdmins: 3,
      totalPosts: 3200,
      totalLikes: 15600,
      pendingVerifications: 8,
    });

    setRecentUsers([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        joinDate: "2024-01-15",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "business",
        joinDate: "2024-01-14",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "user",
        joinDate: "2024-01-13",
      },
    ]);

    setPendingBusinesses([
      {
        id: 1,
        businessName: "Tech Solutions Inc",
        email: "contact@techsolutions.com",
        submittedDate: "2024-01-15",
      },
      {
        id: 2,
        businessName: "Creative Agency",
        email: "hello@creativeagency.com",
        submittedDate: "2024-01-14",
      },
    ]);
  };

  const handleVerifyBusiness = (businessId: number) => {
    // This would call your API to verify the business
    toast.success("Business verified successfully!");
    setPendingBusinesses((prev) => prev.filter((b) => b.id !== businessId));
    setAdminStats((prev) => ({
      ...prev,
      pendingVerifications: prev.pendingVerifications - 1,
    }));
  };

  const handleRejectBusiness = (businessId: number) => {
    // This would call your API to reject the business
    toast.error("Business verification rejected!");
    setPendingBusinesses((prev) => prev.filter((b) => b.id !== businessId));
    setAdminStats((prev) => ({
      ...prev,
      pendingVerifications: prev.pendingVerifications - 1,
    }));
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!authUser || currentUser?.role !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage users, businesses, and platform content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminStats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Businesses
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminStats.totalBusinesses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">!</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Verifications
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminStats.pendingVerifications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminStats.totalPosts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">♥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Likes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminStats.totalLikes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {adminStats.totalAdmins}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => router.push("/admin/users-table")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Users Table
                </h3>
                <p className="text-gray-600 text-sm">
                  View and manage all users in table format
                </p>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <span className="text-gray-400 ml-2">→</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/businesses-table")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Businesses Table
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage business accounts in table format
                </p>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-gray-400 ml-2">→</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/kyc-approval")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  KYC Approval
                </h3>
                <p className="text-gray-600 text-sm">
                  Review and approve user documents
                </p>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-gray-400 ml-2">→</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/featured-content")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Featured Content
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage featured proposals, businesses, and events
                </p>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">★</span>
                </div>
                <span className="text-gray-400 ml-2">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Business Verifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Pending Business Verifications
              </h3>
            </div>
            <div className="p-6">
              {pendingBusinesses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No pending verifications
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingBusinesses.map((business) => (
                    <div
                      key={business.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {business.businessName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {business.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Submitted: {business.submittedDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerifyBusiness(business.id)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleRejectBusiness(business.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Users
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Joined: {user.joinDate}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "business"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;