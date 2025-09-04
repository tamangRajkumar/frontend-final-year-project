import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { Image1, Profile } from "../../src/assets";
import UserPosts from "../../src/components/dashboard/user/UserPosts";
import SidebarProfileSection from "../../src/components/dashboard/user/SidebarProfileSection";
import { HiOutlineCamera, HiPlus } from "react-icons/hi";
import PostCard from "../../src/components/cards/PostCard";
import PostModalDashboard from "../../src/components/Modal/PostModalDashboard";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchPosts, postLiked, postUnliked } from "../api";
import { toast } from "react-toastify";

const user: NextPage = () => {
  const [postModal, setPostModal] = useState(false);
  const [userData, setUserData] = useState();
  const [authUserCheck, setAuthUserCheck] = useState();
  const [userPosts, setUserPosts] = useState();

  const router = useRouter();

  const handlePostModal = () => {
    setPostModal(true);
  };

  //check whether the user is logged in or not if logged in and isAuthenticated is true then redirect to dashboard
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  console.log(authUser);
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  // console.log(authUser);
  if (authUserCheck == false) {
    router.push("/auth/login");
  }

  const user = useSelector((state: any) => state.authUser.currentUser);
  // console.log(user);

  useEffect(() => {
    setAuthUserCheck(authUser);
    setUserData(user);
  });

  //get user posts
  useEffect(() => {
    if (currentUser && token) getUserPosts();
  }, [token]);

  // Fetch user Posts in dashboard
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

              {/* Add New Post Button */}

              <div
                className="mt-8 flex justify-center items-center "
                onClick={handlePostModal}
              >
                <input
                  type="text"
                  className="bg-white shadow-md cursor-pointer focus:outline-none  rounded-2xl pl-5 py-1.5 text-gray-900 font-base"
                  placeholder="Add New Post"
                />
                <div className="bg-white shadow-lg  ml-3 rounded-md p-[0.5px] cursor-pointer">
                  <HiPlus className="h-6 w-6 " />
                </div>
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

export default user;
