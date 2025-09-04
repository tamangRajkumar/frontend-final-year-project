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
  // console.log(userId)

  const handleOptionsDropdown = () => {
    setShowOptionsDropdown((prev) => !prev);
  };

  console.log(userPosts);

  const postOptionsBtnRef = useRef(null);

  // Close Options Dropdown on mouse clicked event
  useEffect(() => {
    const closePostOptionsDropdownOnClick = (e: any) => {
      // setIsMobileViewDropdown(false)
      // console.log(e.path[1]);
      // console.log(profileDropdownBtnRef.current)
      if (e?.path?.[1] !== postOptionsBtnRef.current) {
        setShowOptionsDropdown(false);
        // console.log(e);
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
      {userPosts?.map((post: any) => {
        return (
          <div
            key={post._id}
            className=" w-[90vh]  p-2 rounded-md  shadow-md bg-white"
          >
            <div className="flex justify-between items-center mx-2">
              <div className="flex">
                {/* Profile Image */}
                <Image
                  src={post?.postedBy?.userProfileImage?.url ?? Avatar}
                  alt="Picture of the author"
                  width={50}
                  height={50}
                  className="rounded-full object-cover cursor-pointer"
                />
                {/* Name and time */}
                <div className="ml-3">
                  <p className="text-base font-medium cursor-pointer ">
                    <span className="mr-2">{post.postedBy.fname}</span>
                    {post.postedBy.lname} <span></span>
                  </p>
                  <p className="text-base ">
                    {moment(post.createdAt).calendar()}
                  </p>
                </div>
              </div>

              {/* Options dropdown button */}
              <div onClick={handleOptionsDropdown} ref={postOptionsBtnRef}>
                <HiOutlineDotsHorizontal className="h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div>
              <OptionsDropdown showOptionsDropdown={showOptionsDropdown} />
            </div>

            {/* Post description Show */}
            <div className=" pt-4 pb-1 ml-2 ">
              <p>{post.description}</p>
            </div>

            {/* Posted Image  */}

            <div
              onClick={() => singlePostView(post)}
              className="flex justify-center items-center relative   h-[60vh] "
            >
              <Image
                src={post.image.url}
                alt="Picture of the user"
                layout="fill"
                objectFit="contain"
                className="cursor-pointer"
              />
            </div>

            {/* Like and comment */}
            <div className="grid grid-cols-3 justify-between mx-5 items-center mt-5 mb-2 pt-2  ">
              <div className="flex  space-x-1  ">
                {post?.likes?.includes(userId) ? (
                  <>
                    <div onClick={() => handlePostUnliked(post._id)}>
                      <HiHeart className="h-6 w-6 text-red-600 cursor-pointer" />
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={() => handlePostLiked(post._id)}>
                      <HiHeart className="h-6 w-6 text-white outline-2  stroke-gray-900 stroke-2 cursor-pointer" />
                    </div>
                  </>
                )}
                <div className="flex pl-1 ">
                  <p className="pr-1">{post?.likes?.length} </p>
                  <p>Likes</p>
                </div>
              </div>
              <div
                className="space-x-1 flex items-center justify-center cursor-pointer"
                onClick={() => singlePostView(post)}
              >
                <span>{post?.comments?.length} </span>
                <span>comments</span>
              </div>
              <div className="flex items-center justify-end">
                <p className="cursor-pointer">Share</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PostCard;
