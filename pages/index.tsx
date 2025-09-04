import type { NextPage } from "next";
import { useEffect, useState } from "react";
import PostCard from "../src/components/cards/PostCard";
import { fetchAllPosts, postLiked, postUnliked } from "./api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// import Head from 'next/head'

const Home: NextPage = () => {
  const [userPosts, setUserPosts] = useState();

  // Get token from store
  const token = useSelector((state: any) => state.authUser.token);

  //get user posts
  useEffect(() => {
    getUserPosts();
  }, []);

  // Fetch all users Posts news feed
  const getUserPosts = async () => {
    try {
      const category = "user_post";
      const { data } = await fetchAllPosts(category);
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
      toast.error("Please Login to like");
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
    <div className=" pt-10">
      <div className="flex justify-center items-center">
        <div className="space-y-16">
          <PostCard
            userPosts={userPosts}
            handlePostLiked={handlePostLiked}
            handlePostUnliked={handlePostUnliked}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
