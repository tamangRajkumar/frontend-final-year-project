import React, { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { Avatar, Image1, Profile } from "../../../src/assets";
import Comments from "../../../src/components/individualPostRoute/Comments";
import { useRouter } from "next/router";
import {
  deletePostComment,
  fetchIndividualPost,
  fetchPostCommentsDataOnly,
  postCommentSubmit,
} from "../../api";
import moment from "moment";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import OptionsDropdown from "../../../src/components/dropdown/PostEditOptions/OptionsDropdown";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const IndividualPost: NextPage = () => {
  const router = useRouter();
  const postOptionsButtonRef = useRef(null);

  // console.log(router.query._id)
  const postId = router.query._id;
  // console.log(postId)

  const [post, setPost] = useState<any>();
console.log({post})
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  // Get comments data
  const [postCommentsData, setPostCommentsData] = useState();
  // postCommentsData && console.log(postCommentsData[0])

  // Comments state
  const [addComment, setAddComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  console.log(addComment);

  // Get Token from state
  const token = useSelector((state: any) => state?.authUser?.token);

  // Options Dropdown Show Hide
  const handleOptionsDropdown = () => {
    setShowOptionsDropdown((prev) => !prev);
  };

  // fetch post
  useEffect(() => {
    if (postId) fetchPosts();
  }, [postId]);

  // Fetch individual post by its id
  const fetchPosts = async () => {
    try {
      // console.log(postId)
      const { data } = await fetchIndividualPost(postId);
      // console.log("Fetch posts called");

      data && console.log(data?.data.comments);
      setPost(data?.data);
      console.log(data);
      setPostCommentsData(data?.data?.comments);
    } catch (error) {
      console.log("Error=> ", error);
    }
  };

  // Submit comments
  const handleAddComments = async () => {
    if (!addComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    setIsSubmittingComment(true);
    try {
      const { data } = await postCommentSubmit(addComment, postId, token);
      console.log("Comment submission response:", data);
      
      if (data.success) {
        // Refetch the post to get updated comments
        await fetchPosts();
        setAddComment("");
        toast.success("Your comment is posted successfully");
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    } catch (error) {
      console.log("Error=> ", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Fetch comments only alternative method to fetch comments only -> this is to re-render the post comments after a comment has been deleted
  // const fetchCommentsOnly = async () => {
  //   try {
  //     const { data } = await fetchPostCommentsDataOnly(postId, token);
  //     // console.log(data)
  //     setPostCommentsData(data);
  //   } catch (error) {
  //     console.log("Error=> ", error);
  //   }
  // };

  // handle delete comment by its id
  const handleDeleteComment = async (commentData: any) => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!answer) return;
      const commentId = commentData._id;
      
      const { data } = await deletePostComment(postId, commentId, token);
      console.log("Delete comment response:", data);
      
      if (data.postCommentDeleted == "true") {
        // Refetch the post to get updated comments
        await fetchPosts();
        toast.success("Your comment is deleted successfully");
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.log("Error=> ", error);
      toast.error("Failed to delete comment");
    }
  };

  // Close Options Dropdown on mouse clicked event
  // useEffect(() => {
  //   const closePostOptionsDropdownOnClick = (e: any) => {
  //     // setIsMobileViewDropdown(false)
  //     // console.log(e.path[1]);
  //     // console.log(profileDropdownBtnRef.current)
  //     if (e.path[1] !== postOptionsButtonRef.current) {
  //       setShowOptionsDropdown(false);
  //       // console.log(e);
  //     }
  //   };
  //   document.body.addEventListener("click", closePostOptionsDropdownOnClick);

  //   return () =>
  //     document.body.removeEventListener(
  //       "click",
  //       closePostOptionsDropdownOnClick
  //     );
  // }, []);

  return (
    <>
      {post && (
        <>
          <div className="grid grid-cols-2  justify-around px-10 pt-5 mt-16 ">
            <div className="mx-10 mt-10 ">
              <div className="sticky top-32  ">
                <Image
                  src={post.image.url}
                  height={500}
                  width={500}
                  objectFit="contain"
                  // layout="fill"
                  alt="Picture of the user"
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className=" bg-white">
              <div className="flex justify-between items-center mx-2">
                <div className="flex">
                  {/* Profile Image */}
                  <Image
                    src={post?.postedBy?.userProfileImage?.url || Avatar}
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
                <div
                  className="flex justify-end "
                  onClick={handleOptionsDropdown}
                  ref={postOptionsButtonRef}
                >
                  <HiOutlineDotsHorizontal className="h-6 w-6 cursor-pointer" />
                </div>
              </div>
              {/* Show Options Dropdown  */}
              <div>
                <OptionsDropdown showOptionsDropdown={showOptionsDropdown} />
              </div>

              {/* post description */}
              <div className="ml-3 mt-4">
                <p>{post.description}</p>
              </div>

              {/* Comments in the post  */}
              <div>
                <Comments
                  addComment={addComment}
                  setAddComment={setAddComment}
                  handleAddComments={handleAddComments}
                  postCommentsData={postCommentsData}
                  handleDeleteComment={handleDeleteComment}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default IndividualPost;
