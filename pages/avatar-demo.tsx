import React from 'react';
import { NextPage } from 'next';
import ProfileAvatar from '../src/components/common/ProfileAvatar';

const AvatarDemo: NextPage = () => {
  // Sample users with different scenarios
  const sampleUsers = [
    {
      _id: '1',
      fname: 'John',
      lname: 'Doe',
      userProfileImage: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        public_id: 'sample1'
      }
    },
    {
      _id: '2',
      fname: 'Jane',
      lname: 'Smith',
      userProfileImage: null // No profile image
    },
    {
      _id: '3',
      fname: 'Mike',
      lname: 'Johnson',
      userProfileImage: {
        url: '', // Empty URL
        public_id: 'sample3'
      }
    },
    {
      _id: '4',
      fname: 'Sarah',
      lname: 'Wilson',
      userProfileImage: {
        url: 'https://invalid-url.com/image.jpg', // Invalid URL
        public_id: 'sample4'
      }
    },
    {
      _id: '5',
      fname: 'Tech',
      lname: 'Startup',
      businessInfo: {
        businessName: 'Tech Startup Inc'
      },
      userProfileImage: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        public_id: 'sample5'
      }
    },
    {
      _id: '6',
      fname: 'Business',
      lname: 'Corp',
      businessInfo: {
        businessName: 'Business Corp'
      },
      userProfileImage: null // No profile image for business
    },
    {
      _id: '7',
      fname: 'Single',
      lname: 'Name',
      userProfileImage: null // Single name user
    },
    {
      _id: '8',
      fname: '',
      lname: '',
      businessInfo: {
        businessName: 'Single Word Business'
      },
      userProfileImage: null // Single word business
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Avatar Demo</h1>
          <p className="text-lg text-gray-600">Showcasing profile images with initials fallback in chat</p>
        </div>

        {/* Size Variations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Size Variations</h2>
          <div className="space-y-8">
            {sampleUsers.slice(0, 3).map((user, index) => (
              <div key={user._id} className="flex items-center space-x-8">
                <div className="text-sm font-medium text-gray-700 w-20">
                  {user.businessInfo?.businessName || `${user.fname} ${user.lname}`}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <ProfileAvatar user={user} size="xs" />
                    <p className="text-xs text-gray-500 mt-1">XS</p>
                  </div>
                  <div className="text-center">
                    <ProfileAvatar user={user} size="sm" />
                    <p className="text-xs text-gray-500 mt-1">SM</p>
                  </div>
                  <div className="text-center">
                    <ProfileAvatar user={user} size="md" />
                    <p className="text-xs text-gray-500 mt-1">MD</p>
                  </div>
                  <div className="text-center">
                    <ProfileAvatar user={user} size="lg" />
                    <p className="text-xs text-gray-500 mt-1">LG</p>
                  </div>
                  <div className="text-center">
                    <ProfileAvatar user={user} size="xl" />
                    <p className="text-xs text-gray-500 mt-1">XL</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Status */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Online Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Online Users</h3>
              <div className="space-y-4">
                {sampleUsers.slice(0, 4).map((user) => (
                  <div key={user._id} className="flex items-center space-x-3">
                    <ProfileAvatar
                      user={user}
                      size="md"
                      showOnlineStatus={true}
                      isOnline={true}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.businessInfo?.businessName || `${user.fname} ${user.lname}`}
                      </p>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Offline Users</h3>
              <div className="space-y-4">
                {sampleUsers.slice(4, 8).map((user) => (
                  <div key={user._id} className="flex items-center space-x-3">
                    <ProfileAvatar
                      user={user}
                      size="md"
                      showOnlineStatus={true}
                      isOnline={false}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.businessInfo?.businessName || `${user.fname} ${user.lname}`}
                      </p>
                      <p className="text-sm text-gray-500">Offline</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Scenarios */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Chat Scenarios</h2>
          
          {/* Chat List */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Chat List (Sidebar)</h3>
            <div className="space-y-3">
              {sampleUsers.slice(0, 5).map((user, index) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <ProfileAvatar
                    user={user}
                    size="lg"
                    showOnlineStatus={true}
                    isOnline={index % 2 === 0}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {user.businessInfo?.businessName || `${user.fname} ${user.lname}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {index % 2 === 0 ? 'Hey, how are you?' : 'Thanks for the message!'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {index % 2 === 0 ? '2m' : '1h'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Bubbles */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Message Bubbles</h3>
            <div className="space-y-4">
              {sampleUsers.slice(0, 4).map((user, index) => (
                <div key={user._id} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-end space-x-2 max-w-xs ${
                    index % 2 === 0 ? '' : 'flex-row-reverse space-x-reverse'
                  }`}>
                    {index % 2 === 0 && (
                      <ProfileAvatar user={user} size="sm" />
                    )}
                    <div className={`px-4 py-2 rounded-2xl ${
                      index % 2 === 0 
                        ? 'bg-gray-200 text-gray-900' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <p className="text-sm">
                        {index % 2 === 0 ? 'Hello! How are you doing?' : 'I\'m doing great, thanks!'}
                      </p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        index % 2 === 0 ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        <span className="text-xs">2:30 PM</span>
                        {index % 2 !== 0 && (
                          <span className="text-xs">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edge Cases */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edge Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Empty Names</h3>
              <div className="space-y-4">
                {sampleUsers.slice(6, 8).map((user) => (
                  <div key={user._id} className="flex items-center space-x-3">
                    <ProfileAvatar user={user} size="md" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.businessInfo?.businessName || `${user.fname} ${user.lname}` || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Initials: {user.businessInfo?.businessName ? 
                          user.businessInfo.businessName.charAt(0) : 
                          `${user.fname?.charAt(0) || '?'}${user.lname?.charAt(0) || '?'}`
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Image Loading Errors</h3>
              <div className="space-y-4">
                {sampleUsers.slice(2, 4).map((user) => (
                  <div key={user._id} className="flex items-center space-x-3">
                    <ProfileAvatar user={user} size="md" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.businessInfo?.businessName || `${user.fname} ${user.lname}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.userProfileImage?.url === '' ? 'Empty URL' : 'Invalid URL'}
                      </p>
                    </div>
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

export default AvatarDemo;
