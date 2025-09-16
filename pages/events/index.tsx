import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiSearch,
  HiFilter,
  HiRefresh,
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiUsers,
  HiCurrencyDollar,
  HiHeart,
  HiChat,
  HiTag
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getAllEvents } from "../api";

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  eventType: 'online' | 'offline' | 'hybrid';
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  registrationFee: number;
  currency: string;
  organizer: {
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
  tags: string[];
  requirements: string[];
  benefits: string[];
  contactInfo: {
    email: string;
    phone?: string;
    website?: string;
  };
  registeredUsers: any[];
  likes: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

const EventsPage: NextPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const categories = [
    "technology",
    "business",
    "education",
    "health",
    "entertainment",
    "sports",
    "networking",
    "workshop",
    "conference",
    "other"
  ];

  const eventTypes = [
    "online",
    "offline",
    "hybrid"
  ];

  useEffect(() => {
    fetchEvents();
  }, [pagination.currentPage, searchTerm, selectedCategory, selectedEventType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedEventType && { eventType: selectedEventType })
      };

      const { data } = await getAllEvents(params, token);
      
      if (data.success) {
        setEvents(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchEvents();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleEventTypeChange = (eventType: string) => {
    setSelectedEventType(eventType);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventFull = (registeredCount: number, maxAttendees: number) => {
    return registeredCount >= maxAttendees;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HiCalendar className="h-8 w-8 mr-3 text-blue-600" />
                Events
              </h1>
              <p className="text-gray-600 mt-2">
                Discover and register for exciting events in your area
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total Events: {pagination.totalEvents}
              </div>
              <button
                onClick={fetchEvents}
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
                    placeholder="Search events by title, description, or tags..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedEventType}
                  onChange={(e) => handleEventTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
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

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <HiCalendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory || selectedEventType
                ? "Try adjusting your search criteria" 
                : "No events available at the moment"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Event Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {event.organizer.userProfileImage?.url ? (
                            <img
                              src={event.organizer.userProfileImage.url}
                              alt={event.organizer.fname}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 font-semibold text-sm">
                              {event.organizer.fname?.charAt(0)}{event.organizer.lname?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {event.organizer.businessInfo?.businessName || `${event.organizer.fname} ${event.organizer.lname}`}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(event.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                          {event.eventType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {event.description}
                    </p>

                    {/* Event Image */}
                    {event.image?.url && (
                      <div className="mb-4">
                        <img
                          src={event.image.url}
                          alt="Event image"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <HiCalendar className="h-4 w-4 text-blue-600 mr-2" />
                        <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <HiClock className="h-4 w-4 text-green-600 mr-2" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <HiLocationMarker className="h-4 w-4 text-red-600 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <HiUsers className="h-4 w-4 text-purple-600 mr-2" />
                        <span>
                          {event.registeredUsers.length}/{event.maxAttendees} registered
                          {isEventFull(event.registeredUsers.length, event.maxAttendees) && (
                            <span className="text-red-600 font-medium ml-1">(Full)</span>
                          )}
                        </span>
                      </div>
                      
                      {event.registrationFee > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <HiCurrencyDollar className="h-4 w-4 text-green-600 mr-2" />
                          <span>{formatCurrency(event.registrationFee, event.currency)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              #{tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{event.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Event Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <HiHeart className="h-4 w-4 mr-1" />
                          {event.likes.length}
                        </span>
                        <span className="flex items-center">
                          <HiChat className="h-4 w-4 mr-1" />
                          {event.comments.length}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => router.push(`/events/${event._id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                      {currentUser && !isEventFull(event.registeredUsers.length, event.maxAttendees) && (
                        <button
                          onClick={() => router.push(`/events/${event._id}`)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Register
                        </button>
                      )}
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
                        {Math.min(pagination.currentPage * pagination.limit, pagination.totalEvents)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{pagination.totalEvents}</span>{' '}
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
      </div>
    </div>
  );
};

export default EventsPage;


