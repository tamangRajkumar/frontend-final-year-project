import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { Image1, Profile } from "../../src/assets";
import { HiOutlineCamera, HiPlus, HiChartBar, HiUsers, HiEye, HiHeart, HiBriefcase, HiUserGroup } from "react-icons/hi";
import PostCard from "../../src/components/cards/PostCard";
import PostModalDashboard from "../../src/components/Modal/PostModalDashboard";
import CreatePostModal from "../../src/components/posts/CreatePostModal";
import CreateEventModal from "../../src/components/events/CreateEventModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchPosts, postLiked, postUnliked, getPostsByUser, getEventsByOrganizer } from "../api";
import { toast } from "react-toastify";

const Business: NextPage = () => {
  const [postModal, setPostModal] = useState(false);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [userData, setUserData] = useState();
  const [authUserCheck, setAuthUserCheck] = useState();
  const [userPosts, setUserPosts] = useState();
  const [businessStats, setBusinessStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalViews: 0,
    followers: 0,
  });
  const [businessProposals, setBusinessProposals] = useState([]);
  const [businessEvents, setBusinessEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'proposals', or 'events'
  const [createEventModal, setCreateEventModal] = useState(false);

  const router = useRouter();

  const handlePostModal = () => {
    setPostModal(true);
  };

  const handleCreatePostModal = () => {
    setCreatePostModal(true);
  };

  const handleCreateEventModal = () => {
    setCreateEventModal(true);
  };

  //check whether the user is logged in or not if logged in and isAuthenticated is true then redirect to dashboard
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  
  if (authUserCheck == false) {
    router.push("/auth/login");
  }

  // Check if user has business role
  useEffect(() => {
    if (currentUser && currentUser.role !== 'business') {
      router.push("/dashboard/user");
      toast.error("Access denied. Business account required.");
    }
  }, [currentUser, router]);

  const user = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    setAuthUserCheck(authUser);
    setUserData(user);
  });

  //get user posts
  useEffect(() => {
    if (currentUser && token) {
      getUserPosts();
      getBusinessProposals();
      getBusinessEvents();
      calculateBusinessStats();
    }
  }, [token, currentUser]);

  // Fetch user Posts in dashboard
  const getUserPosts = async () => {
    try {
      const { data } = await fetchPosts(token);
      setUserPosts(data);
      console.log(data);
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  const getBusinessProposals = async () => {
    try {
      const { data } = await getPostsByUser(currentUser._id, { postType: 'business_proposal' }, token);
      if (data.success) {
        setBusinessProposals(data.data);
      }
    } catch (error) {
      console.log("Error fetching business proposals:", error);
    }
  };

  const getBusinessEvents = async () => {
    try {
      const { data } = await getEventsByOrganizer(currentUser._id, {}, token);
      if (data.success) {
        setBusinessEvents(data.data);
      }
    } catch (error) {
      console.log("Error fetching business events:", error);
    }
  };

  // Calculate business statistics
  const calculateBusinessStats = () => {
    if (userPosts) {
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
      const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
      
      setBusinessStats({
        totalPosts: userPosts.length,
        totalLikes,
        totalViews,
        followers: 0, // This would come from a followers system
      });
    }
  };

  // Handle Post liked by user
  const handlePostLiked = async (postId: any) => {
    try {
      const { data } = await postLiked(postId, token);
      console.log(data);
      if (data.postLiked) {
        getUserPosts();
        toast.success("Post Liked");
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  //Handle Post unliked by user
  const handlePostUnliked = async (postId: any) => {
    try {
      console.log(postId);
      const { data } = await postUnliked(postId, token);
      if (data.postUnliked) {
        getUserPosts();
        toast.success("Post Unliked");
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  return (
    <>
      {authUserCheck && currentUser?.role === 'business' && (
        <>
          <div className="flex flex-row">
            {/* Business Profile Side Bar */}
            <div className="w-80 bg-white shadow-lg h-screen overflow-y-auto">
              <div className="p-6">
                {/* Business Profile Image */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-4">
                    <Image
                      src={userData?.userProfileImage?.url || Profile}
                      alt="Business Profile"
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {userData?.businessInfo?.businessName || `${userData?.fname} ${userData?.lname}`}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {userData?.businessInfo?.businessType || "Business"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {userData?.businessInfo?.isVerified ? "✓ Verified Business" : "Unverified"}
                  </p>
                </div>

                {/* Business Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Analytics</h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HiChartBar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">Total Posts</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{businessStats.totalPosts}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HiHeart className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-600">Total Likes</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{businessStats.totalLikes}</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HiEye className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm text-gray-600">Total Views</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{businessStats.totalViews}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HiUsers className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="text-sm text-gray-600">Followers</span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">{businessStats.followers}</span>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                {userData?.businessInfo && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {userData.businessInfo.businessDescription && (
                        <p><span className="font-medium">Description:</span> {userData.businessInfo.businessDescription}</p>
                      )}
                      {userData.businessInfo.businessWebsite && (
                        <p><span className="font-medium">Website:</span> {userData.businessInfo.businessWebsite}</p>
                      )}
                      {userData.businessInfo.businessPhone && (
                        <p><span className="font-medium">Phone:</span> {userData.businessInfo.businessPhone}</p>
                      )}
                      {userData.businessInfo.businessAddress && (
                        <p><span className="font-medium">Address:</span> {userData.businessInfo.businessAddress}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Layout */}
            <div className="flex-grow relative">
              {/* Cover Image */}
              <div className="relative h-[20vw] w-full">
                <Image
                  src={Image1}
                  alt="Business Cover"
                  layout="fill"
                  objectFit="cover"
                />
                <label className="flex space-x-2 cursor-pointer bg-gray-600 px-2 py-2 absolute right-0 bottom-0">
                  <HiOutlineCamera className="h-6 w-6" />
                  <p>Update cover</p>
                </label>
              </div>

              {/* Add New Post Button */}
              <div className="mt-8 flex justify-center items-center space-x-4">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={handlePostModal}
                >
                  <input
                    type="text"
                    className="bg-white shadow-md cursor-pointer focus:outline-none rounded-2xl pl-5 py-1.5 text-gray-900 font-base"
                    placeholder="Share your business updates... (Legacy)"
                  />
                  <div className="bg-white shadow-lg ml-3 rounded-md p-[0.5px] cursor-pointer">
                    <HiPlus className="h-6 w-6" />
                  </div>
                </div>
                
                <button
                  onClick={handleCreatePostModal}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <HiPlus className="h-5 w-5" />
                  <span>Create Post</span>
                </button>
              </div>

              {/* Post Modal Show Hide */}
              {postModal && (
                <PostModalDashboard
                  dashboardTrue={true}
                  editPost={false}
                  setPostModal={setPostModal}
                  getUserPosts={getUserPosts}
                />
              )}

              {/* Create Post Modal */}
              {createPostModal && (
                <CreatePostModal
                  isOpen={createPostModal}
                  onClose={() => setCreatePostModal(false)}
                  onPostCreated={getUserPosts}
                />
              )}

              {/* Create Event Modal */}
              {createEventModal && (
                <CreateEventModal
                  isOpen={createEventModal}
                  onClose={() => setCreateEventModal(false)}
                  onEventCreated={getBusinessEvents}
                />
              )}

              {/* Tab Navigation */}
              <div className="mt-8">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-5">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'posts'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveTab('proposals')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'proposals'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Business Proposals
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'events'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Events
                  </button>
                </div>
              </div>

              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className="mt-8">
                  <span className="font-bold text-lg ml-5">Your Business Posts</span>
                  <div className="flex justify-center items-center mt-5">
                    <div className="space-y-16">
                      <PostCard
                        userPosts={userPosts}
                        handlePostLiked={handlePostLiked}
                        handlePostUnliked={handlePostUnliked}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Business Proposals Tab */}
              {activeTab === 'proposals' && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg ml-5 flex items-center">
                      <HiBriefcase className="h-6 w-6 mr-2 text-blue-600" />
                      Your Business Proposals
                    </h3>
                    <button
                      onClick={handleCreatePostModal}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mr-5"
                    >
                      <HiPlus className="h-4 w-4" />
                      <span>Create Proposal</span>
                    </button>
                  </div>

                  {businessProposals.length === 0 ? (
                    <div className="text-center py-12">
                      <HiBriefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
                      <p className="text-gray-500 mb-4">Create your first business proposal to find partners</p>
                      <button
                        onClick={handleCreatePostModal}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Create Proposal
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {businessProposals.map((proposal: any) => (
                        <div key={proposal._id} className="bg-white rounded-lg shadow-md p-6 mx-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <HiBriefcase className="h-5 w-5 text-blue-600 mr-2" />
                                <h4 className="text-lg font-semibold text-gray-900">{proposal.title}</h4>
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {proposal.businessProposal?.partnershipType?.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{proposal.description}</p>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <HiUsers className="h-4 w-4 mr-1" />
                                  {proposal.businessProposal?.registeredUsers?.length || 0} registered
                                </span>
                                <span className="flex items-center">
                                  <HiHeart className="h-4 w-4 mr-1" />
                                  {proposal.likes?.length || 0} likes
                                </span>
                                <span className="flex items-center">
                                  <HiEye className="h-4 w-4 mr-1" />
                                  {proposal.comments?.length || 0} comments
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => router.push(`/proposals/${proposal._id}`)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => router.push(`/dashboard/business/proposals/${proposal._id}/registrations`)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                              >
                                <HiUserGroup className="h-4 w-4" />
                                <span>Registrations</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg ml-5 flex items-center">
                      <HiCalendar className="h-6 w-6 mr-2 text-blue-600" />
                      Your Events
                    </h3>
                    <button
                      onClick={handleCreateEventModal}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mr-5"
                    >
                      <HiPlus className="h-4 w-4" />
                      <span>Create Event</span>
                    </button>
                  </div>

                  {businessEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <HiCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                      <p className="text-gray-500 mb-4">Create your first event to engage with your audience</p>
                      <button
                        onClick={handleCreateEventModal}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {businessEvents.map((event: any) => (
                        <div key={event._id} className="bg-white rounded-lg shadow-md p-6 mx-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <HiCalendar className="h-5 w-5 text-blue-600 mr-2" />
                                <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {event.eventType}
                                </span>
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {event.category}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <HiUsers className="h-4 w-4 mr-1" />
                                  {event.registeredUsers?.length || 0} registered
                                </span>
                                <span className="flex items-center">
                                  <HiHeart className="h-4 w-4 mr-1" />
                                  {event.likes?.length || 0} likes
                                </span>
                                <span className="flex items-center">
                                  <HiEye className="h-4 w-4 mr-1" />
                                  {event.comments?.length || 0} comments
                                </span>
                                {event.registrationFee > 0 && (
                                  <span className="flex items-center">
                                    <HiCurrencyDollar className="h-4 w-4 mr-1" />
                                    ${event.registrationFee}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => router.push(`/events/${event._id}`)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => router.push(`/dashboard/business/events/${event._id}/edit`)}
                                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => router.push(`/dashboard/business/events/${event._id}/registrations`)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                              >
                                <HiUserGroup className="h-4 w-4" />
                                <span>Registrations</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this event?')) {
                                    // Handle delete
                                  }
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Business;
