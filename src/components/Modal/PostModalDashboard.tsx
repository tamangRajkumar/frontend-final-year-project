import React, { useState } from "react";
import type { NextPage } from "next";
import { HiOutlineX, HiPlus, HiTrash } from "react-icons/hi";
import { Avatar } from "../../assets";
import Image from "next/image";
import BackgroundGray from "./BackgroundGray";
import { postSubmit, uploadImage } from "../../../pages/api";
import { IPostSubmitData } from "../../typeScript";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const PostModalDashboard: NextPage = ({
  dashboardTrue,
  editPost,
  setPostModal,
  getUserPosts,
}: any) => {
  const [postSubmitData, setPostSubmitData] = useState<IPostSubmitData>({
    description: "",
    category: {
      post: "user_post",
    },
    image: {
      url: "",
      public_id: "",
    },
  });

  const router = useRouter();

  // console.log(postSubmitData.description)

  // get token from state
  const token = useSelector((state: any) => state.authUser.token);

  // Handle Image Upload
  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    // console.log([...formData]);
    try {
      const { data } = await uploadImage(formData, token);
      // console.log(data);
      setPostSubmitData({ ...postSubmitData, image: data });
      // console.log(postSubmitData.image);
    } catch (error) {
      console.log("Error=> ", error);
      
    }
  };

  // handle Post Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await postSubmit(postSubmitData, token);
      // console.log(postSubmitData);
      // console.log(token);
      console.log(data);

      if (data.saved == "true") {
        console.log("Called");

        toast.success("Your Post is created successfully");
        setPostModal(false);
        getUserPosts();
        router.push("/dashboard/user");
      }
    } catch (error) {
      console.log("Error =>", error);
    }
  };

  return (
    <>
      {/* Post Form Start */}
      <BackgroundGray dashboardTrue={dashboardTrue} />
      <div
        style={{ width: "40rem" }}
        className="fixed ml-auto mr-auto left-0 right-0 bg-white  top-20  z-50 rounded-lg"
      >
        <div className="flex  justify-between  mx-10 mt-3">
          {/* check if post is to be edited or not */}
          {editPost ? (
            <div className="mt-2 text-xl font-semibold ">Edit Post</div>
          ) : (
            <div className="mt-2 text-xl font-semibold ">Post</div>
          )}

          <div>
            <button
              // onClick={() => handlePostModal(false)}
              onClick={() => setPostModal(false)}
              className="focus:outline-none"
            >
              <HiOutlineX className="h-8 w-8 text-gray-400 bg-white shadow-md p-1 rounded-full " />
            </button>
          </div>
        </div>

        <div className="mt-3 mx-8 ">
          <textarea
            type="text"
            className=" h-28 w-full focus:outline-none rounded-xl p-2 border-2 border-gray-300 "
            placeholder="Write descriptions............"
            value={postSubmitData.description}
            onChange={(e) =>
              setPostSubmitData({
                ...postSubmitData,
                description: e.target.value,
              })
            }
          ></textarea>
        </div>

        {/* Select Category  */}
        {/* <div className="ml-8 mt-2">
          <p className="text-base font-medium text-gray-500 mb-1.5">
            Categories
          </p>
          <select
            value={postSubmitData.category}
            onChange={(e) => {
              setPostSubmitData({
                ...postSubmitData,
                category: e.target.value,
              });
            }}
            className="px-1 py-1 focus:outline-none border-2 border-gray-300 rounded-md cursor-pointer"
          >
            <option value="">Select</option>
            <option value="adopt_pets">Adopt Pets</option>
            <option value="pets_problems_and_solutions">
              Pets Problems And Solutions
            </option>
            <option value="nearest_vetneries">Nearest Vetneries</option>
            <option value="lost_and_found">Lost and Found</option>
          </select>
        </div> */}

        {/* Upload Image Section */}
        <div className="flex justify-between ml-8 mt-8  items-center mr-10">
          <div className="ml-2">
            <label className="flex flex-col shadow-md bg-gray-100 cursor-pointer rounded-md h-24 w-32  justify-center items-center">
              <input
                type="file"
                accept="images/*"
                hidden
                // value={postSubmitData.image.url}
                onChange={handleImage}
              />

              <HiPlus className="h-12 w-12 text-gray-500 " />
              <p className="text-base text-gray-500 font-normal">
                Upload Image
              </p>
            </label>
          </div>
          <div className="flex-col justify-center items-center text-center ">
            {/* Delete Image Icon */}
            {postSubmitData.image && postSubmitData.image.url ? (
              <div className="flex justify-end  ">
                <button
                  // onClick={handleImageUploaded}
                  className="rounded-full shadow-md p-2 mb-2 focus:outline-none"
                >
                  <HiTrash className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ) : (
              ""
            )}

            {/* image Preview */}
            {postSubmitData.image && postSubmitData.image.url ? (
              <Image
                //  loader={myLoader}
                src={postSubmitData.image.url}
                alt=""
                height={150}
                width={150}
                className=""
              />
            ) : (
              <Image
                src={Avatar}
                alt=""
                height={100}
                width={100}
                className=""
              />
            )}

            <p className="font-semibold text-base text-gray-500 mt-2">
              Image Preview
            </p>
          </div>
        </div>
        {editPost ? (
          <div className="flex justify-center items-center mt-0.5 ">
            <button
              type="submit"
              // onClick={handleUpdatePost}
              className="border focus:outline-none bg-gray-900 text-white rounded-2xl shadow-xl px-6   py-3 font-bold m-3 hover: transform hover:scale-110  hover:shadow-xl "
            >
              Update Post
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-0.5 ">
            <button
              type="submit"
              onClick={handleSubmit}
              className="border focus:outline-none bg-gray-900 text-white rounded-2xl shadow-xl px-6   py-3 font-bold m-3 hover: transform hover:scale-110  hover:shadow-xl "
            >
               Post Now
            </button>
          </div>
        )}
      </div>

      {/* Post Form  End*/}
    </>
  );
};

export default PostModalDashboard;
