import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiSearch,
  HiFilter,
  HiRefresh,
  HiPlus,
  HiBriefcase,
  HiCurrencyDollar,
  HiLocationMarker,
  HiClock,
  HiMail,
  HiPhone,
  HiGlobe,
  HiUser,
  HiHeart,
  HiChat,
  HiStar
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getAllPosts, toggleFeaturedProposal } from "../api";
import CreatePostModal from "../../src/components/posts/CreatePostModal";

interface BusinessProposal {
  _id: string;
  title: string;
  description: string;
  category: string;
  postType: 'business_proposal';
  postedBy: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    role: string;
    userProfileImage?: {
      url: string;
      public_id: string;
    };
    businessInfo?: {
      businessName: string;
      businessType: string;
    };
  };
  image?: {
    url: string;
    public_id: string;
  };
  businessProposal: {
    industry: string;
    investmentAmount: {
      min: number;
      max: number;
      currency: string;
    };
    partnershipType: string;
    location: string;
    duration: string;
    requirements: string[];
    benefits: string[];
    contactInfo: {
      email: string;
      phone?: string;
      website?: string;
    };
    isActive: boolean;
    interestedParties: any[];
  };
  likes: any[];
  comments: any[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const ProposalsPage: NextPage = () => {
  const [proposals, setProposals] = useState<BusinessProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedPartnershipType, setSelectedPartnershipType] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProposals: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Food & Beverage",
    "Transportation",
    "Energy",
    "Entertainment",
    "Other"
  ];

  const partnershipTypes = [
    "equity",
    "joint_venture",
    "franchise",
    "distribution",
    "other"
  ];

  useEffect(() => {
    fetchProposals();
  }, [pagination.currentPage, searchTerm, selectedIndustry, selectedPartnershipType]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        postType: 'business_proposal',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedIndustry && { industry: selectedIndustry }),
        ...(selectedPartnershipType && { partnershipType: selectedPartnershipType })
      };

      const { data } = await getAllPosts(params, token);
      
      if (data.success) {
        setProposals(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to fetch business proposals");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleToggleFeatured = async (proposalId: string) => {
    try {
      const { data } = await toggleFeaturedProposal(proposalId, token);
      if (data.success) {
        toast.success(data.message);
        fetchProposals();
      }
    } catch (error) {
      console.error("Error toggling featured proposal:", error);
      toast.error("Failed to toggle featured status");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProposals();
  };

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePostCreated = () => {
    fetchProposals();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPartnershipType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HiBriefcase className="h-8 w-8 mr-3 text-blue-600" />
                Business Proposals
              </h1>
              <p className="text-gray-600 mt-2">
                Discover partnership opportunities and investment prospects
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total Proposals: {pagination.totalProposals}
              </div>
              {currentUser?.role === 'business' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <HiPlus className="h-4 w-4" />
                  <span>Create Proposal</span>
                </button>
              )}
              <button
                onClick={fetchProposals}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
              >
                <HiRefresh className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search proposals by title, description, or industry..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedIndustry}
                  onChange={(e) => {
                    setSelectedIndustry(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedPartnershipType}
                  onChange={(e) => {
                    setSelectedPartnershipType(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Partnership Types</option>
                  {partnershipTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatPartnershipType(type)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <HiSearch className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Proposals Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <HiBriefcase className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedIndustry || selectedPartnershipType
                ? "Try adjusting your search criteria" 
                : "No business proposals available at the moment"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {proposals.map((proposal) => (
                <div key={proposal._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Proposal Header */}
                  <div className="p-4 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {proposal.postedBy.userProfileImage?.url ? (
                            <img
                              src={proposal.postedBy.userProfileImage.url}
                              alt={proposal.postedBy.fname}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <HiBriefcase className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {proposal.postedBy.businessInfo?.businessName || `${proposal.postedBy.fname} ${proposal.postedBy.lname}`}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(proposal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <HiBriefcase className="h-3 w-3 mr-1" />
                        Proposal
                      </span>
                    </div>
                  </div>

                  {/* Proposal Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {proposal.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {proposal.description}
                    </p>

                    {/* Proposal Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <HiBriefcase className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-600">{proposal.businessProposal.industry}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <HiCurrencyDollar className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-600">
                          {formatCurrency(proposal.businessProposal.investmentAmount.min, proposal.businessProposal.investmentAmount.currency)} - 
                          {formatCurrency(proposal.businessProposal.investmentAmount.max, proposal.businessProposal.investmentAmount.currency)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <HiLocationMarker className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-gray-600">{proposal.businessProposal.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <HiClock className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-600">{proposal.businessProposal.duration}</span>
                      </div>
                    </div>

                    {/* Partnership Type */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {formatPartnershipType(proposal.businessProposal.partnershipType)}
                      </span>
                    </div>

                    {/* Requirements Preview */}
                    {proposal.businessProposal.requirements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Key Requirements:</h5>
                        <div className="space-y-1">
                          {proposal.businessProposal.requirements.slice(0, 2).map((req, index) => (
                            <p key={index} className="text-xs text-gray-600 line-clamp-1">
                              • {req}
                            </p>
                          ))}
                          {proposal.businessProposal.requirements.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{proposal.businessProposal.requirements.length - 2} more requirements
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Post Image */}
                    {proposal.image?.url && (
                      <div className="mb-4">
                        <img
                          src={proposal.image.url}
                          alt="Proposal image"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {proposal.tags && proposal.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {proposal.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              #{tag}
                            </span>
                          ))}
                          {proposal.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{proposal.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Proposal Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <HiHeart className="h-4 w-4 mr-1" />
                          {proposal.likes.length}
                        </span>
                        <span className="flex items-center">
                          <HiChat className="h-4 w-4 mr-1" />
                          {proposal.comments.length}
                        </span>
                        <span className="flex items-center">
                          <HiUser className="h-4 w-4 mr-1" />
                          {proposal.businessProposal.interestedParties.length}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <HiMail className="h-3 w-3" />
                          <span>{proposal.businessProposal.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/proposals/${proposal._id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            View Details
                          </button>
                          {currentUser?.role === 'admin' && (
                            <button
                              onClick={() => handleToggleFeatured(proposal._id)}
                              className={`p-1 rounded transition-colors ${
                                proposal.isFeatured 
                                  ? 'text-yellow-500 hover:text-yellow-600' 
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                              title={proposal.isFeatured ? 'Remove from featured' : 'Add to featured'}
                            >
                              {proposal.isFeatured ? (
                                <HiStar className="h-4 w-4" />
                              ) : (
                                <HiStar className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {currentUser && (
                            <button
                              onClick={() => router.push(`/proposals/${proposal._id}`)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Register
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                        {Math.min(pagination.currentPage * pagination.limit, pagination.totalProposals)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{pagination.totalProposals}</span>{' '}
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
                        ←
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Proposal Modal */}
        {showCreateModal && (
          <CreatePostModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </div>
    </div>
  );
};

export default ProposalsPage;
