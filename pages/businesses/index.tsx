import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiBriefcase, 
  HiSearch, 
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiMail,
  HiLocationMarker,
  HiCalendar,
  HiGlobe,
  HiPhone,
  HiChevronLeft,
  HiChevronRight,
  HiChat
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getBusinessesList, verifyBusiness, createOrGetChat } from "../api";
import RoleGuard from "../../src/components/auth/RoleGuard";

const BusinessesList: NextPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBusinesses: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  const [filters, setFilters] = useState({
    search: "",
    verified: "",
    page: 1
  });

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (token) {
      fetchBusinesses();
    }
  }, [token, filters]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.verified && { verified: filters.verified })
      };

      const { data } = await getBusinessesList(params, token);
      
      if (data.success) {
        setBusinesses(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast.error("Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleVerifyBusiness = (businessId: string, isVerified: boolean) => {
    verifyBusiness(businessId, isVerified, token)
      .then(({ data }) => {
        if (data.success) {
          toast.success(data.message);
          fetchBusinesses();
        }
      })
      .catch((error) => {
        console.error("Error verifying business:", error);
        toast.error("Failed to verify business");
      });
  };

  const handleStartChat = async (businessId: string) => {
    try {
      const { data } = await createOrGetChat(businessId, token);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <RoleGuard allowedRoles={['admin', 'business']}>
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HiBriefcase className="h-8 w-8 mr-3 text-orange-600" />
                  Businesses Directory
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and verify business accounts
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Total Businesses: {pagination.totalBusinesses}
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
                    placeholder="Search by business name, owner name, or email..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filters.verified}
                  onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value, page: 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Businesses</option>
                  <option value="true">Verified</option>
                  <option value="false">Pending Verification</option>
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

          {/* Businesses Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {businesses.map((business: any) => (
                <div key={business._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Business Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          {business.userProfileImage?.url ? (
                            <img
                              src={business.userProfileImage.url}
                              alt={business.businessInfo?.businessName || business.fname}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <HiBriefcase className="h-6 w-6 text-orange-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {business.businessInfo?.businessName || `${business.fname} ${business.lname}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {business.businessInfo?.businessType || 'Business'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          business.businessInfo?.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {business.businessInfo?.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Business Owner Info */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Business Owner</h4>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <HiMail className="h-4 w-4 mr-2" />
                          {business.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <HiLocationMarker className="h-4 w-4 mr-2" />
                          {business.country}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <HiCalendar className="h-4 w-4 mr-2" />
                          Joined {formatDate(business.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Business Details */}
                    {business.businessInfo && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Business Information</h4>
                        <div className="space-y-1">
                          {business.businessInfo.businessDescription && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {business.businessInfo.businessDescription}
                            </p>
                          )}
                          {business.businessInfo.businessWebsite && (
                            <div className="flex items-center text-sm text-orange-600">
                              <HiGlobe className="h-4 w-4 mr-2" />
                              <a 
                                href={business.businessInfo.businessWebsite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                          {business.businessInfo.businessPhone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <HiPhone className="h-4 w-4 mr-2" />
                              {business.businessInfo.businessPhone}
                            </div>
                          )}
                          {business.businessInfo.businessAddress && (
                            <div className="flex items-center text-sm text-gray-600">
                              <HiLocationMarker className="h-4 w-4 mr-2" />
                              <span className="line-clamp-1">{business.businessInfo.businessAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/users/${business._id}`)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                      >
                        <HiEye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      
                      {currentUser && business._id !== currentUser._id && (
                        <button
                          onClick={() => handleStartChat(business._id)}
                          className="px-3 py-2 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                        >
                          <HiChat className="h-4 w-4 mr-1" />
                          Chat
                        </button>
                      )}
                      
                      {currentUser?.role === 'admin' && (
                        <div className="flex space-x-1">
                          {!business.businessInfo?.isVerified ? (
                            <button
                              onClick={() => handleVerifyBusiness(business._id, true)}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center text-sm"
                              title="Verify Business"
                            >
                              <HiCheckCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerifyBusiness(business._id, false)}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center text-sm"
                              title="Unverify Business"
                            >
                              <HiXCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
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
                      {Math.min(pagination.currentPage * pagination.limit, pagination.totalBusinesses)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalBusinesses}</span>{' '}
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

export default BusinessesList;
