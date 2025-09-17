import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { HiSearch, HiFilter, HiX, HiUser, HiBriefcase, HiDocumentText, HiCalendar } from "react-icons/hi";
import { searchUsers, searchPosts, searchBusinesses, searchEvents } from "./api";
import { toast } from "react-toastify";
import ProfileAvatar from "../src/components/common/ProfileAvatar";
import moment from "moment";

interface SearchResult {
  users: any[];
  posts: any[];
  businesses: any[];
  events: any[];
}

const SearchPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    users: [],
    posts: [],
    businesses: [],
    events: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'businesses' | 'events'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    dateRange: '',
    sortBy: 'relevance'
  });
  const [filteredResults, setFilteredResults] = useState<SearchResult>({
    users: [],
    posts: [],
    businesses: [],
    events: []
  });

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);

  useEffect(() => {
    const { q } = router.query;
    if (q && typeof q === 'string') {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [router.query]);

  useEffect(() => {
    applyFilters();
  }, [searchResults, filters, activeTab]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      console.log("Performing search for:", query);
      const [usersRes, postsRes, businessesRes, eventsRes] = await Promise.all([
        searchUsers(query, token),
        searchPosts(query, token),
        searchBusinesses(query, token),
        searchEvents(query, token)
      ]);

      console.log("Search responses:", { usersRes, postsRes, businessesRes, eventsRes });

      const results: SearchResult = {
        users: usersRes.data.success ? usersRes.data.data : [],
        posts: postsRes.data.success ? postsRes.data.data : [],
        businesses: businessesRes.data.success ? businessesRes.data.data : [],
        events: eventsRes.data.success ? eventsRes.data.data : []
      };

      console.log("Processed results:", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log("Applying filters to:", searchResults);
    let filtered = { ...searchResults };

    // Filter by role
    if (filters.role) {
      filtered.users = filtered.users.filter(user => user.role === filters.role);
      filtered.businesses = filtered.businesses.filter(business => business.role === filters.role);
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      const daysAgo = filters.dateRange === 'week' ? 7 : filters.dateRange === 'month' ? 30 : 0;
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

      filtered.posts = filtered.posts.filter(post => new Date(post.createdAt) >= cutoffDate);
      filtered.events = filtered.events.filter(event => new Date(event.createdAt) >= cutoffDate);
    }

    // Sort results
    if (filters.sortBy === 'newest') {
      filtered.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      filtered.events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      filtered.posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      filtered.events.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    console.log("Filtered results:", filtered);
    setFilteredResults(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      dateRange: '',
      sortBy: 'relevance'
    });
  };

  const getTotalResults = () => {
    return filteredResults.users.length + filteredResults.posts.length + 
           filteredResults.businesses.length + filteredResults.events.length;
  };

  const renderUsers = () => (
    <div className="space-y-4">
      {filteredResults.users.map((user) => (
        <div key={user._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <ProfileAvatar user={user} size="md" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {user.businessInfo?.businessName || `${user.fname} ${user.lname}`}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.country}</p>
              {user.goals && user.goals.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {user.goals.slice(0, 3).map((goal: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {goal}
                      </span>
                    ))}
                    {user.goals.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{user.goals.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push(`/users/${user._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-4">
      {filteredResults.posts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <ProfileAvatar user={post.author} size="sm" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {post.author.businessInfo?.businessName || `${post.author.fname} ${post.author.lname}`}
                </h3>
                <span className="text-sm text-gray-500">
                  {moment(post.createdAt).fromNow()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{post.content}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.likes?.length || 0} likes</span>
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBusinesses = () => (
    <div className="space-y-4">
      {filteredResults.businesses.map((business) => (
        <div key={business._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <ProfileAvatar user={business} size="md" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{business.businessInfo?.businessName}</h3>
              <p className="text-sm text-gray-600">{business.email}</p>
              <p className="text-sm text-gray-500">{business.businessInfo?.businessType}</p>
              {business.businessInfo?.businessDescription && (
                <p className="text-sm text-gray-700 mt-2">{business.businessInfo.businessDescription}</p>
              )}
            </div>
            <button
              onClick={() => router.push(`/users/${business._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Business
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-4">
      {filteredResults.events.map((event) => (
        <div key={event._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <HiCalendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                {event.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{event.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{moment(event.eventDate).format('MMM DD, YYYY')}</span>
                <span>{event.location}</span>
                <span>{event.attendees?.length || 0} attendees</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/events/${event._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, posts, businesses, events..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <HiFilter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Type</option>
                    <option value="user">Users</option>
                    <option value="business">Businesses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : searchQuery ? (
          <div>
            {/* Results Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                Found {getTotalResults()} results
              </p>
              {/* Debug info */}
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <p>Debug: Users: {filteredResults.users.length}, Posts: {filteredResults.posts.length}, Businesses: {filteredResults.businesses.length}, Events: {filteredResults.events.length}</p>
                <p>Search Results: {JSON.stringify(searchResults, null, 2)}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { key: 'all', label: 'All', count: getTotalResults() },
                    { key: 'users', label: 'Users', count: filteredResults.users.length },
                    { key: 'posts', label: 'Posts', count: filteredResults.posts.length },
                    { key: 'businesses', label: 'Businesses', count: filteredResults.businesses.length },
                    { key: 'events', label: 'Events', count: filteredResults.events.length }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Results Content */}
            <div className="space-y-8">
              {(activeTab === 'all' || activeTab === 'users') && filteredResults.users.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HiUser className="h-5 w-5 mr-2" />
                    Users ({filteredResults.users.length})
                  </h3>
                  {renderUsers()}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'posts') && filteredResults.posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HiDocumentText className="h-5 w-5 mr-2" />
                    Posts ({filteredResults.posts.length})
                  </h3>
                  {renderPosts()}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'businesses') && filteredResults.businesses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HiBriefcase className="h-5 w-5 mr-2" />
                    Businesses ({filteredResults.businesses.length})
                  </h3>
                  {renderBusinesses()}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'events') && filteredResults.events.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HiCalendar className="h-5 w-5 mr-2" />
                    Events ({filteredResults.events.length})
                  </h3>
                  {renderEvents()}
                </div>
              )}

              {getTotalResults() === 0 && (
                <div className="text-center py-12">
                  <HiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <HiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for anything</h3>
            <p className="text-gray-500">Enter a search term to find users, posts, businesses, and events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
