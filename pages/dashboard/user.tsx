import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { Image1, Profile } from "../../src/assets";
import UserPosts from "../../src/components/dashboard/user/UserPosts";
import SidebarProfileSection from "../../src/components/dashboard/user/SidebarProfileSection";
import { HiOutlineCamera, HiPlus } from "react-icons/hi";
import PostCard from "../../src/components/cards/PostCard";
import PostModalDashboard from "../../src/components/Modal/PostModalDashboard";
import CreatePostModal from "../../src/components/posts/CreatePostModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchPosts, postLiked, postUnliked, getGoalsAndSkills } from "../api";
import { toast } from "react-toastify";

const User: NextPage = () => {
  const [postModal, setPostModal] = useState(false);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [userData, setUserData] = useState();
  const [authUserCheck, setAuthUserCheck] = useState();
  const [userPosts, setUserPosts] = useState();
  const [isClient, setIsClient] = useState(false);
  const [goalsAndSkills, setGoalsAndSkills] = useState({ goals: [], skills: [] });

  const router = useRouter();

  // All hooks must be called at the top level, before any conditional returns
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  const user = useSelector((state: any) => state.authUser.currentUser);

  const handlePostModal = () => {
    setPostModal(true);
  };

  const handleCreatePostModal = () => {
    setCreatePostModal(true);
  };

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect based on user role
  useEffect(() => {
    if (isClient && currentUser && authUser) {
      const userRole = currentUser.role;
      switch (userRole) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "business":
          router.push("/dashboard/business");
          break;
        case "user":
        default:
          // Stay on user dashboard
          break;
      }
    }
  }, [currentUser, authUser, router, isClient]);

  // Fetch user Posts in dashboard - Define function before using it
  const getUserPosts = async () => {
    try {
      const { data } = await fetchPosts(token);
      setUserPosts(data);
      console.log(data);
      // console.log(data[1]._id);

      {
        // posts && console.log(posts[0]._id);
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  useEffect(() => {
    setAuthUserCheck(authUser);
    setUserData(user);
  }, [authUser, user]);

  // Handle Post liked by user
  const handlePostLiked = async (postId: any) => {
    try {
      // console.log(postId)
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
      // console.log(data);
      if (data.postUnliked) {
        getUserPosts();
        toast.success("Post Unliked");
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  //get user posts
  useEffect(() => {
    if (currentUser && token) getUserPosts();
  }, [token, currentUser, getUserPosts]);

  // Fetch goals and skills
  const fetchGoalsAndSkills = async () => {
    try {
      const { data } = await getGoalsAndSkills(token);
      if (data.success) {
        setGoalsAndSkills(data.data);
        // Update userData with goals and skills for sidebar
        setUserData(prev => ({
          ...prev,
          goals: data.data.goals,
          skills: data.data.skills
        }));
      }
    } catch (error) {
      console.error("Error fetching goals and skills:", error);
    }
  };

  useEffect(() => {
    if (currentUser && token) {
      fetchGoalsAndSkills();
    }
  }, [token, currentUser]);
  
  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (authUserCheck == false) {
    router.push("/auth/login");
  }
  

  return (
    <>
      {authUserCheck && (
        <>
          <div className="flex flex-row  ">
            {/* User profile Side Bar */}
            <SidebarProfileSection userData={userData} />

            {/* Posts Layout */}
            <div className=" flex-grow relative">
              {/* Cover Image  */}
              <div className=" relative   h-[20vw] w-[full]  ">
                <Image
                  src={Image1}
                  alt="Picture of the user"
                  layout="fill"
                  objectFit="cover"
                />
                <label className="flex space-x-2 cursor-pointer  bg-gray-600 px-2 py-2 absolute right-0 bottom-0">
                  <HiOutlineCamera className="h-6 w-6" />
                  <p> Update cover </p>
                </label>
              </div>

              {/* Goals and Skills Section */}
              {(goalsAndSkills.goals.length > 0 || goalsAndSkills.skills.length > 0) && (
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Goals & Skills</h2>
                  
                  {/* Goals */}
                  {goalsAndSkills.goals.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Goals</h3>
                      <div className="space-y-2">
                        {goalsAndSkills.goals.slice(0, 5).map((goal: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-700">{goal}</span>
                          </div>
                        ))}
                        {goalsAndSkills.goals.length > 5 && (
                          <p className="text-sm text-gray-500">
                            +{goalsAndSkills.goals.length - 5} more goals
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {goalsAndSkills.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {goalsAndSkills.skills.slice(0, 10).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {goalsAndSkills.skills.length > 10 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            +{goalsAndSkills.skills.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Add New Post Button */}
              <div className="mt-8 flex justify-center items-center space-x-4">
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={handlePostModal}
                >
                  <input
                    type="text"
                    className="bg-white shadow-md cursor-pointer focus:outline-none  rounded-2xl pl-5 py-1.5 text-gray-900 font-base"
                    placeholder="Add New Post"
                  />
                  {/* <div className="bg-white shadow-lg  ml-3 rounded-md p-[0.5px] cursor-pointer">
                    <HiPlus className="h-6 w-6 " />
                  </div> */}
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

              {/* User Posts */}
              <div className="mt-8">
                <span className="font-bold text-lg ml-5">Your Posts</span>
                <div className=" flex justify-center items-center mt-5  ">
                  <div className="space-y-16">
                    <PostCard
                      userPosts={userPosts}
                      handlePostLiked={handlePostLiked}
                      handlePostUnliked={handlePostUnliked}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default User;
