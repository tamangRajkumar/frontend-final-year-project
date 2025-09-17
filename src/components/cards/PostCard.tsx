import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Avatar, Image1, Profile } from "../../assets";
import { HiOutlineDotsHorizontal, HiHeart } from "react-icons/hi";
import Link from "next/link";
import OptionsDropdown from "../dropdown/PostEditOptions/OptionsDropdown";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const PostCard = ({ userPosts, handlePostLiked, handlePostUnliked }: any) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const router = useRouter();

  // Get user Id from state
  const userId = useSelector((state: any) => state?.authUser?.currentUser?._id);
  // // console.log(userId)

  const handleOptionsDropdown = () => {
    setShowOptionsDropdown((prev) => !prev);
  };

  // console.log(userPosts);

  const postOptionsBtnRef = useRef(null);

  // Close Options Dropdown on mouse clicked event
  useEffect(() => {
    const closePostOptionsDropdownOnClick = (e: any) => {
      // setIsMobileViewDropdown(false)
      // // console.log(e.path[1]);
      // // console.log(profileDropdownBtnRef.current)
      if (e?.path?.[1] !== postOptionsBtnRef.current) {
        setShowOptionsDropdown(false);
        // // console.log(e);
      }
    };
    document.body.addEventListener("click", closePostOptionsDropdownOnClick);

    return () =>
      document.body.removeEventListener(
        "click",
        closePostOptionsDropdownOnClick
      );
  }, []);

  // Redirect to single Post view
  const singlePostView = (post: any) => {
    router.push(`/viewpost/individual-post/${post._id}`);
  };

  return (
    <>
      {Array.isArray(userPosts) && userPosts?.map((post: any) => {
        return (
          <div
            key={post._id}
            className="w-[90vh] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4">
              <div className="flex items-center space-x-4">
                {/* Profile Image */}
                <div className="relative">
                  <Image
                    src={post?.postedBy?.userProfileImage?.url || Avatar.src}
                    alt="Picture of the author"
                    width={50}
                    height={50}
                    className="rounded-full object-cover cursor-pointer ring-2 ring-gray-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#f26722] to-[#ff8f57] rounded-full border-2 border-white"></div>
                </div>
                {/* Name and time */}
                <div>
                  <p className="text-lg font-bold text-gray-900 cursor-pointer">
                    {post.postedBy.fname} {post.postedBy.lname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {moment(post.createdAt).calendar()}
                  </p>
                </div>
              </div>

              {/* Options dropdown button */}
              <div onClick={handleOptionsDropdown} ref={postOptionsBtnRef} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
                <HiOutlineDotsHorizontal className="h-5 w-5 text-gray-600" />
              </div>
            </div>

            <div>
              <OptionsDropdown showOptionsDropdown={showOptionsDropdown} />
            </div>

            {/* Post description */}
            <div className="px-6 pb-4">
              <p className="text-gray-700 leading-relaxed">{post.description}</p>
            </div>

            {/* Posted Image */}
            {post?.image?.url && (
              <div
                onClick={() => singlePostView(post)}
                className="relative h-[60vh] overflow-hidden cursor-pointer group"
              >
                <Image
                  src={post.image.url}
                  alt="Picture of the user"
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
            )}

            {/* Action Bar */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => post?.likes?.includes(userId) ? handlePostUnliked(post._id) : handlePostLiked(post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {post?.likes?.includes(userId) ? (
                      <HiHeart className="h-6 w-6 text-red-500" />
                    ) : (
                      <HiHeart className="h-6 w-6" />
                    )}
                    <span className="font-medium">{post?.likes?.length || 0}</span>
                  </button>
                  
                  <button
                    onClick={() => singlePostView(post)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">{post?.comments?.length || 0}</span>
                  </button>
                </div>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {!Array.isArray(userPosts) && (
        <div className="w-[90vh] p-4 rounded-md shadow-md bg-white text-center text-gray-500">
          <p>No posts available</p>
        </div>
      )}
      {Array.isArray(userPosts) && userPosts.length === 0 && (
        <div className="w-[90vh] p-4 rounded-md shadow-md bg-white text-center text-gray-500">
          <p>No posts found</p>
        </div>
      )}
    </>
  );
};

export default PostCard;
