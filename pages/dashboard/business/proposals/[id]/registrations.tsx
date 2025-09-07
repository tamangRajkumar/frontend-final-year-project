import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { 
  HiArrowLeft,
  HiUser,
  HiMail,
  HiPhone,
  HiBriefcase,
  HiCurrencyDollar,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiChat
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getPostById, getRegisteredUsers, updateRegistrationStatus } from "../../../../api";

interface RegisteredUser {
  _id: string;
  user: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    userProfileImage?: {
      url: string;
      public_id: string;
    };
    businessInfo?: {
      businessName: string;
      businessType: string;
    };
  };
  eligibilityReason: string;
  experience: string;
  skills: string[];
  investmentCapacity: string;
  additionalInfo: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  registeredAt: string;
}

const ProposalRegistrationsPage: NextPage = () => {
  const [proposal, setProposal] = useState<any>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (id && token) {
      fetchProposalAndRegistrations();
    }
  }, [id, token]);

  const fetchProposalAndRegistrations = async () => {
    try {
      setLoading(true);
      
      // Fetch proposal details
      const proposalResponse = await getPostById(id as string, token);
      if (proposalResponse.data.success) {
        setProposal(proposalResponse.data.data);
        
        // Check if current user owns this proposal
        if (proposalResponse.data.data.postedBy._id !== currentUser._id) {
          toast.error("You can only view registrations for your own proposals");
          router.push("/dashboard/business");
          return;
        }
      }

      // Fetch registered users
      const registrationsResponse = await getRegisteredUsers(id as string, token);
      if (registrationsResponse.data.success) {
        setRegisteredUsers(registrationsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch proposal data");
      router.push("/dashboard/business");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: string) => {
    try {
      setUpdatingStatus(registrationId);
      const response = await updateRegistrationStatus(id as string, registrationId, newStatus, token);
      
      if (response.data.success) {
        toast.success(`Registration ${newStatus} successfully`);
        setRegisteredUsers(prev => 
          prev.map(reg => 
            reg._id === registrationId 
              ? { ...reg, status: newStatus as any }
              : reg
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update registration status");
    } finally {
      setUpdatingStatus(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvestmentCapacityText = (capacity: string) => {
    switch (capacity) {
      case 'low':
        return 'Low ($1,000 - $10,000)';
      case 'medium':
        return 'Medium ($10,000 - $50,000)';
      case 'high':
        return 'High ($50,000+)';
      default:
        return 'Not specified';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <HiArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HiUser className="h-8 w-8 mr-3 text-green-600" />
                Proposal Registrations
              </h1>
              {proposal && (
                <p className="text-gray-600 mt-2">
                  {proposal.title} - {registeredUsers.length} registrations
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Proposal Summary */}
        {proposal && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Proposal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Industry:</span>
                <span className="ml-2 text-gray-600">{proposal.businessProposal?.industry}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Partnership Type:</span>
                <span className="ml-2 text-gray-600">
                  {proposal.businessProposal?.partnershipType?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Investment Range:</span>
                <span className="ml-2 text-gray-600">
                  ${proposal.businessProposal?.investmentAmount?.min?.toLocaleString()} - 
                  ${proposal.businessProposal?.investmentAmount?.max?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Registrations List */}
        {registeredUsers.length === 0 ? (
          <div className="text-center py-12">
            <HiUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
            <p className="text-gray-500">Users will appear here when they register for your proposal</p>
          </div>
        ) : (
          <div className="space-y-6">
            {registeredUsers.map((registration) => (
              <div key={registration._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Registration Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {registration.user.userProfileImage?.url ? (
                          <img
                            src={registration.user.userProfileImage.url}
                            alt={registration.user.fname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-semibold">
                            {registration.user.fname?.charAt(0)}{registration.user.lname?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {registration.user.fname} {registration.user.lname}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <HiClock className="h-4 w-4 mr-1" />
                          Registered {formatDate(registration.registeredAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <HiChat className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Registration Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Eligibility Reason</h5>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                          {registration.eligibilityReason}
                        </p>
                      </div>

                      {registration.experience && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Experience</h5>
                          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                            {registration.experience}
                          </p>
                        </div>
                      )}

                      {registration.skills && registration.skills.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {registration.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Investment Capacity</h5>
                        <p className="text-gray-600 text-sm flex items-center">
                          <HiCurrencyDollar className="h-4 w-4 mr-1" />
                          {getInvestmentCapacityText(registration.investmentCapacity)}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Contact Information</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <HiMail className="h-4 w-4 mr-2" />
                            {registration.contactInfo.email}
                          </p>
                          {registration.contactInfo.phone && (
                            <p className="flex items-center">
                              <HiPhone className="h-4 w-4 mr-2" />
                              {registration.contactInfo.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {registration.additionalInfo && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Additional Information</h5>
                          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                            {registration.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Full Profile
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Send Message
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(registration._id, 'reviewed')}
                              disabled={updatingStatus === registration._id}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {updatingStatus === registration._id ? 'Updating...' : 'Mark Reviewed'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(registration._id, 'accepted')}
                              disabled={updatingStatus === registration._id}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <HiCheckCircle className="h-4 w-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                              disabled={updatingStatus === registration._id}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <HiXCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        
                        {registration.status === 'reviewed' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(registration._id, 'accepted')}
                              disabled={updatingStatus === registration._id}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <HiCheckCircle className="h-4 w-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                              disabled={updatingStatus === registration._id}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <HiXCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalRegistrationsPage;
