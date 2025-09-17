import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, Image1, Profile } from "../../assets";
import { HiTrash } from "react-icons/hi";
import moment from "moment";
import { useSelector } from "react-redux";
import Link from "next/link";

const Comments = ({
  addComment,
  setAddComment,
  handleAddComments,
  postCommentsData,
  handleDeleteComment,
}: any) => {
  const [isAuthenticated, setIsAuthenticatded] = useState();

  //check whether the user is logged in or not if logged in and isAuthenticated is true
  const userAuth = useSelector((state: any) => state.authUser.isAuthenticated);
  useEffect(() => {
    setIsAuthenticatded(userAuth);
  });


  // Get user ID
  const userId = useSelector((state:any) => state.authUser.currentUser._id);

  // get user from local Storage
  const user =
    userAuth &&
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("user") || "");
  // console.log(user?.userProfileImage?.url);
  const profileUrl = user?.userProfileImage?.url ?? Avatar;

  return (
    <>
      <div className="flex flex-col mx-10 my-5">
        <div className="flex flex-col ">
          {/* Heading */}
          <div>
            <h1 className="text-lg font-semibold mt-5 mb-1">Comments</h1>
          </div>

          {/* Mapping all the comments that are in the post */}

          {postCommentsData && postCommentsData.length > 0 ? (
            postCommentsData.map((commentData: any) => {
              return (
                <>
                  <div
                    key={commentData._id}
                    className="mb-10   border-t-2 pt-5"
                  >
                    {/* Profile and posted By */}
                    <div className=" flex ">
                      {/* Profile Image */}
                      <Image
                        src={commentData?.postedBy?.userProfileImage?.url || Avatar.src}
                        alt="Picture of the author"
                        width={50}
                        height={50}
                        className="rounded-full object-cover cursor-pointer"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-base">
                          <span className="mr-1">
                            {commentData.postedBy.fname}
                          </span>{" "}
                          <span>{commentData?.postedBy?.lname}</span>
                        </p>
                        <p>{moment(commentData?.created).calendar()}</p>
                      </div>
                    </div>

                    {/* comment */}
                    <div>
                      <div className="flex  mt-5 justify-between items-center">
                        {/* Typed Comment */}
                        <div className="flex w-full ml-5 mr-4  bg-gray-100 rounded-lg pl-5 py-2 ">
                          <p>{commentData?.text}</p>
                          {/* <p>{commentData._id}</p> */}
                        </div>
                        {/* Delete Comment button Icon */}

                        {userId == commentData.postedBy._id && (
                          <>
                            <div className="">
                              <button
                                onClick={() => handleDeleteComment(commentData)}
                                className="focus:outline-none"
                              >
                                <HiTrash className="h-8 w-8 mr-5 focus:outline-none text-red-400 bg-white shadow-md p-1 rounded-full " />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <>
              {/* if no any comments */}
              <p className="my-2 text-semibold font-normal bg-gray-200 py-2 px-5 rounded-xl">
                No any Comments yet{" "}
              </p>
            </>
          )}

          {isAuthenticated ? (
            <>
              {/* Input Comment */}
              <div className="mt-8 flex  ">
                <div className="flex justify-center items-center">
                  {/* Profile Image */}
                  <Image
                    src={profileUrl}
                    alt="Picture of the author"
                    width={50}
                    height={50}
                    className="rounded-full object-cover cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  className="w-full bg-gray-200 shadow-sm rounded-full  px-7 py-1 ml-5 focus:outline-none  "
                  placeholder="Post Your Comment"
                  value={addComment}
                  onChange={(e) => {
                    setAddComment(e.target.value);
                  }}
                />

                <div className="ml-4">
                  <button
                    type="submit"
                    onClick={handleAddComments}
                    className=" rounded-xl py-2 px-3 my-1 focus:outline-none font-bold text-base shadow-md border-2 border-gray-100 hover:border-gray-900 hover:border-1 hover:text-white hover:bg-gray-900 :text-gray-900 :bg-white transform hover:scale-110 hover:shadow-xl duration-150"
                  >
                    <p> Post</p>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <p className="text-lg text-gray-700 font-normal rounded-lg">
                Please log in to comment
              </p>
              <Link href="/auth/login">
                <a className="flex justify-center items-center text-lg text-center  text-gray-900 font-bold bg-gray-400 rounded-xl py-2 mt-2 cursor-pointer">
                  Log in
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comments;
