import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  HiStar,
  HiBriefcase,
  HiUsers,
  HiCalendar,
  HiArrowRight,
  HiHeart,
  HiChat,
  HiEye,
  HiCurrencyDollar,
  HiLocationMarker,
  HiClock
} from "react-icons/hi";
import { getFeaturedContent } from "./api";

interface FeaturedContent {
  featuredProposals: any[];
  featuredBusinesses: any[];
  featuredEvents: any[];
}

const Home: NextPage = () => {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent>({
    featuredProposals: [],
    featuredBusinesses: [],
    featuredEvents: []
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);
      const { data } = await getFeaturedContent();
      if (data.success) {
        setFeaturedContent(data.data);
      }
    } catch (error) {
      console.error("Error fetching featured content:", error);
      toast.error("Failed to fetch featured content");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover featured business proposals, connect with verified businesses, and join exciting events in your area.
          </p>
        </div>

        {/* Featured Proposals Section */}
        {featuredContent.featuredProposals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <HiStar className="h-6 w-6 mr-2 text-yellow-500" />
                Featured Business Proposals
              </h2>
              <button
                onClick={() => router.push('/proposals')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <HiArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.featuredProposals.slice(0, 6).map((proposal) => (
                <div key={proposal._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
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
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <HiStar className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {proposal.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {proposal.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center">
                        <HiUsers className="h-3 w-3 mr-1" />
                        {proposal.businessProposal?.registeredUsers?.length || 0} registered
                      </span>
                      <span className="flex items-center">
                        <HiHeart className="h-3 w-3 mr-1" />
                        {proposal.likes?.length || 0} likes
                      </span>
                    </div>
                    
                    <button
                      onClick={() => router.push(`/proposals/${proposal._id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Businesses Section */}
        {featuredContent.featuredBusinesses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <HiUsers className="h-6 w-6 mr-2 text-green-600" />
                Featured Businesses
              </h2>
              <button
                onClick={() => router.push('/businesses')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <HiArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredContent.featuredBusinesses.slice(0, 8).map((business) => (
                <div key={business._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {business.userProfileImage?.url ? (
                        <img
                          src={business.userProfileImage.url}
                          alt={business.fname}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-green-600 font-semibold text-lg">
                          {business.fname?.charAt(0)}{business.lname?.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {business.businessInfo?.businessName || `${business.fname} ${business.lname}`}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {business.businessInfo?.businessType}
                    </p>
                    
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-4">
                      <HiStar className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                    
                    <button
                      onClick={() => router.push(`/users/${business._id}`)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Events Section */}
        {featuredContent.featuredEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <HiCalendar className="h-6 w-6 mr-2 text-purple-600" />
                Featured Events
              </h2>
              <button
                onClick={() => router.push('/events')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <HiArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.featuredEvents.slice(0, 6).map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image?.url && (
                    <img
                      src={event.image.url}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        {event.organizer.userProfileImage?.url ? (
                          <img
                            src={event.organizer.userProfileImage.url}
                            alt={event.organizer.fname}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-purple-600 font-semibold text-xs">
                            {event.organizer.fname?.charAt(0)}{event.organizer.lname?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {event.organizer.businessInfo?.businessName || `${event.organizer.fname} ${event.organizer.lname}`}
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <HiStar className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <HiCalendar className="h-3 w-3 mr-2" />
                        {formatDate(event.startDate)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <HiClock className="h-3 w-3 mr-2" />
                        {formatTime(event.startTime)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <HiLocationMarker className="h-3 w-3 mr-2" />
                        {event.location}
                      </div>
                      {event.registrationFee > 0 && (
                        <div className="flex items-center text-xs text-gray-500">
                          <HiCurrencyDollar className="h-3 w-3 mr-2" />
                          {formatCurrency(event.registrationFee, event.currency)}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => router.push(`/events/${event._id}`)}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      View Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join our platform to discover business opportunities, connect with verified businesses, and participate in exciting events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/signup')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </button>
            <button
              onClick={() => router.push('/proposals')}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Proposals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
