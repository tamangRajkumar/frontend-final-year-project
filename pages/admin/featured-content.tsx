import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiStar,
  HiStarSolid,
  HiBriefcase,
  HiUsers,
  HiCalendar,
  HiRefresh,
  HiEye,
  HiTrash
} from "react-icons/hi";
import { toast } from "react-toastify";
import { 
  toggleFeaturedEvent,
  getFeaturedEvents,
  toggleFeaturedProposal,
  getFeaturedPosts
} from "../api/index";
import RoleGuard from "../../src/components/auth/RoleGuard";

interface FeaturedContent {
  featuredProposals: any[];
  featuredEvents: any[];
}

const FeaturedContentPage: NextPage = () => {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent>({
    featuredProposals: [],
    featuredEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'proposals' | 'events'>('proposals');

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (token && currentUser?.role === 'admin') {
      fetchFeaturedContent();
    } else {
      router.push("/auth/login");
    }
  }, [token, currentUser]);

  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);
      const [eventsResponse, postsResponse] = await Promise.all([
        getFeaturedEvents(token),
        getFeaturedPosts(token)
      ]);
      
      if (eventsResponse.data.success && postsResponse.data.success) {
        setFeaturedContent({ 
          featuredEvents: eventsResponse.data.data,
          featuredProposals: postsResponse.data.data
        });
      }
    } catch (error) {
      console.error("Error fetching featured content:", error);
      toast.error("Failed to fetch featured content");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (type: 'proposal' | 'event', id: string) => {
    try {
      let response;
      if (type === 'proposal') {
        response = await toggleFeaturedProposal(id, false, token);
      } else {
        response = await toggleFeaturedEvent(id, false, token);
      }
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchFeaturedContent();
      }
    } catch (error) {
      console.error(`Error toggling featured ${type}:`, error);
      toast.error(`Failed to toggle featured ${type}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HiStar className="h-8 w-8 mr-3 text-yellow-500" />
                  Featured Content Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage featured proposals, businesses, and events for the homepage
                </p>
              </div>
              <button
                onClick={fetchFeaturedContent}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
              >
                <HiRefresh className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  activeTab === 'proposals'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <HiBriefcase className="h-4 w-4 mr-2" />
                Proposals ({featuredContent.featuredProposals.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  activeTab === 'events'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <HiCalendar className="h-4 w-4 mr-2" />
                Events ({featuredContent.featuredEvents.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {/* Featured Proposals */}
            {activeTab === 'proposals' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <HiBriefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Featured Business Proposals
                </h2>
                
                {featuredContent.featuredProposals.length === 0 ? (
                  <div className="text-center py-12">
                    <HiBriefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No featured proposals</h3>
                    <p className="text-gray-500">No business proposals are currently featured</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredContent.featuredProposals.map((proposal) => (
                      <div key={proposal._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              {proposal.postedBy.userProfileImage?.url ? (
                                <img
                                  src={proposal.postedBy.userProfileImage.url}
                                  alt={proposal.postedBy.fname}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-blue-600 font-semibold text-sm">
                                  {proposal.postedBy.fname?.charAt(0)}{proposal.postedBy.lname?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {proposal.postedBy.businessInfo?.businessName || `${proposal.postedBy.fname} ${proposal.postedBy.lname}`}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Featured {formatDate(proposal.featuredAt)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleFeatured('proposal', proposal._id)}
                            className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors"
                            title="Remove from featured"
                          >
                            <HiStarSolid className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {proposal.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {proposal.description}
                        </p>
                        
                        {proposal.businessProposal && (
                          <div className="mb-3 text-xs text-gray-500">
                            <div className="flex items-center justify-between">
                              <span>Industry: {proposal.businessProposal.industry}</span>
                              <span>Investment: ${proposal.businessProposal.investmentAmount?.min || 0} - ${proposal.businessProposal.investmentAmount?.max || 0}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <HiUsers className="h-3 w-3 mr-1" />
                            {proposal.businessProposal?.interestedParties?.length || 0} interested
                          </span>
                          <span className="flex items-center">
                            <HiStar className="h-3 w-3 mr-1" />
                            {proposal.likes?.length || 0} likes
                          </span>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => router.push(`/posts/${proposal._id}`)}
                            className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center"
                          >
                            <HiEye className="h-3 w-3 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Featured Events */}
            {activeTab === 'events' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <HiCalendar className="h-5 w-5 mr-2 text-purple-600" />
                  Featured Events
                </h2>
                
                {featuredContent.featuredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <HiCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No featured events</h3>
                    <p className="text-gray-500">No events are currently featured</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredContent.featuredEvents.map((event) => (
                      <div key={event._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              {event.organizer.userProfileImage?.url ? (
                                <img
                                  src={event.organizer.userProfileImage.url}
                                  alt={event.organizer.fname}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-purple-600 font-semibold text-sm">
                                  {event.organizer.fname?.charAt(0)}{event.organizer.lname?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {event.organizer.businessInfo?.businessName || `${event.organizer.fname} ${event.organizer.lname}`}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Featured {formatDate(event.featuredAt)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleFeatured('event', event._id)}
                            className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors"
                            title="Remove from featured"
                          >
                            <HiStarSolid className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <HiUsers className="h-3 w-3 mr-1" />
                            {event.registeredUsers?.length || 0} registered
                          </span>
                          <span className="flex items-center">
                            <HiStar className="h-3 w-3 mr-1" />
                            {event.likes?.length || 0} likes
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/events/${event._id}`)}
                            className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center"
                          >
                            <HiEye className="h-3 w-3 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default FeaturedContentPage;


