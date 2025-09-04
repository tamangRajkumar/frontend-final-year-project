import React from "react";
import UserPosts from "../../src/components/dashboard/user/UserPosts";

const index = () => {
  return (
    <>
      <div className="mt-10">
        <p className="text-center mb-10 font-bold text-2xl">Your Favorite Posts</p>

        <div className="flex  flex-wrap justify-center items-center">
          <UserPosts />
        </div>
      </div>
    </>
  );
};

export default index;
