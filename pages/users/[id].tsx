import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { 
  HiArrowLeft,
  HiMail,
  HiLocationMarker,
  HiCalendar,
  HiBriefcase,
  HiGlobe,
  HiPhone,
  HiCheckCircle,
  HiXCircle,
  HiCog
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getUserById, updateUserRole, verifyBusiness } from "../api";
import RoleGuard from "../../src/components/auth/RoleGuard";

const UserDetail: NextPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (id && token) {
      fetchUser();
    }
  }, [id, token]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await getUserById(id as string, token);
      
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user) return;
    
    try {
      setUpdating(true);
      const { data } = await updateUserRole(user._id, newRole, token);
      
      if (data.success) {
        toast.success("User role updated successfully");
        setUser(data.data);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyBusiness = async (isVerified: boolean) => {
    if (!user) return;
    
    try {
      setUpdating(true);
      const { data } = await verifyBusiness(user._id, isVerified, token);
      
      if (data.success) {
        toast.success(data.message);
        setUser(data.data);
      }
    } catch (error) {
      console.error("Error verifying business:", error);
      toast.error("Failed to verify business");
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <HiArrowLeft className="h-5 w-5 mr-2" />
              Back to Users
            </button>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.userProfileImage?.url ? (
                      <img
                        src={user.userProfileImage.url}
                        alt={user.fname}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-semibold text-2xl">
                        {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {user.fname} {user.lname}
                  </h2>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>

                {/* Basic Info */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <HiMail className="h-4 w-4 mr-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <HiLocationMarker className="h-4 w-4 mr-3" />
                    {user.country}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <HiCalendar className="h-4 w-4 mr-3" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>

                {/* Admin Actions */}
                {currentUser?.role === 'admin' && (
                  <div className="mt-6 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Change Role
                      </label>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        disabled={updating}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="business">Business</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {user.role === 'business' && user.businessInfo && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Business Verification
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.businessInfo.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.businessInfo.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleVerifyBusiness(!user.businessInfo.isVerified)}
                          disabled={updating}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            user.businessInfo.isVerified
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } disabled:opacity-50`}
                        >
                          {user.businessInfo.isVerified ? 'Unverify Business' : 'Verify Business'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">First Name</label>
                      <p className="text-sm text-gray-900">{user.fname}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Name</label>
                      <p className="text-sm text-gray-900">{user.lname}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-sm text-gray-900">{user.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Country</label>
                      <p className="text-sm text-gray-900">{user.country}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                {user.role === 'business' && user.businessInfo && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiBriefcase className="h-5 w-5 mr-2" />
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Business Name</label>
                        <p className="text-sm text-gray-900">{user.businessInfo.businessName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Business Type</label>
                        <p className="text-sm text-gray-900">{user.businessInfo.businessType}</p>
                      </div>
                      {user.businessInfo.businessDescription && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Description</label>
                          <p className="text-sm text-gray-900">{user.businessInfo.businessDescription}</p>
                        </div>
                      )}
                      {user.businessInfo.businessWebsite && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Website</label>
                          <a 
                            href={user.businessInfo.businessWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            <HiGlobe className="h-4 w-4 mr-1" />
                            {user.businessInfo.businessWebsite}
                          </a>
                        </div>
                      )}
                      {user.businessInfo.businessPhone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-sm text-gray-900 flex items-center">
                            <HiPhone className="h-4 w-4 mr-1" />
                            {user.businessInfo.businessPhone}
                          </p>
                        </div>
                      )}
                      {user.businessInfo.businessAddress && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Address</label>
                          <p className="text-sm text-gray-900 flex items-center">
                            <HiLocationMarker className="h-4 w-4 mr-1" />
                            {user.businessInfo.businessAddress}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Verification Status</label>
                        <div className="flex items-center">
                          {user.businessInfo.isVerified ? (
                            <HiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <HiXCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className={`text-sm ${
                            user.businessInfo.isVerified ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {user.businessInfo.isVerified ? 'Verified Business' : 'Pending Verification'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">User ID</label>
                      <p className="text-sm text-gray-900 font-mono">{user._id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Account Created</label>
                      <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserDetail;

