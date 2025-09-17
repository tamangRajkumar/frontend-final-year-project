import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { HiSearch, HiFilter, HiUser, HiBriefcase, HiDocumentText, HiCalendar, HiLightningBolt } from "react-icons/hi";

const SearchDemo: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const demoQueries = [
    "JavaScript developer",
    "React projects",
    "Business proposals",
    "Tech events",
    "Marketing skills",
    "Startup ideas"
  ];

  const features = [
    {
      icon: <HiSearch className="h-8 w-8 text-blue-600" />,
      title: "Universal Search",
      description: "Search across users, posts, businesses, and events with a single query"
    },
    {
      icon: <HiFilter className="h-8 w-8 text-green-600" />,
      title: "Advanced Filters",
      description: "Filter by role, date range, and sort by relevance or date"
    },
    {
      icon: <HiLightningBolt className="h-8 w-8 text-yellow-600" />,
      title: "Real-time Results",
      description: "Get instant search results with live filtering and sorting"
    },
    {
      icon: <HiUser className="h-8 w-8 text-purple-600" />,
      title: "User Profiles",
      description: "Find users by name, skills, goals, and professional information"
    },
    {
      icon: <HiDocumentText className="h-8 w-8 text-orange-600" />,
      title: "Content Discovery",
      description: "Discover posts and proposals by content, tags, and categories"
    },
    {
      icon: <HiCalendar className="h-8 w-8 text-red-600" />,
      title: "Event Search",
      description: "Find events by title, description, location, and date"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Demo</h1>
          <p className="text-lg text-gray-600 mb-8">
            Experience the power of our comprehensive search functionality
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Try the Search</h2>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, posts, businesses, events..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Demo Queries */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Try these example searches:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {demoQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(query)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Search Types */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">What You Can Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HiUser className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Users & Profiles</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Search by name, email, or location</li>
                    <li>• Find users by skills and goals</li>
                    <li>• Filter by user role (user/business)</li>
                    <li>• View detailed profiles with contact info</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <HiDocumentText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Posts & Content</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Search post content and descriptions</li>
                    <li>• Find posts by tags and categories</li>
                    <li>• Discover business proposals</li>
                    <li>• Filter by post type and date</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HiBriefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Businesses</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Search by business name and type</li>
                    <li>• Find businesses by industry</li>
                    <li>• Discover verified businesses</li>
                    <li>• View business descriptions and contact info</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <HiCalendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Search events by title and description</li>
                    <li>• Find events by location and date</li>
                    <li>• Discover upcoming events</li>
                    <li>• Filter by event type and organizer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Advanced Filtering</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiFilter className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Filter</h3>
              <p className="text-gray-600">Filter results by user role (users, businesses, or all)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCalendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Date Range</h3>
              <p className="text-gray-600">Filter by time period (past week, month, or all time)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiLightningBolt className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sort Options</h3>
              <p className="text-gray-600">Sort by relevance, newest, or oldest results</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/search')}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Searching Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDemo;
