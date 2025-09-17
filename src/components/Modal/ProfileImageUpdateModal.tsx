import React, { useState } from "react";
import type { NextPage } from "next";
import { HiOutlineX, HiPlus, HiTrash } from "react-icons/hi";
import { Avatar, Profile } from "../../assets";
import Image from "next/image";
import BackgroundGray from "./BackgroundGray";
import { postSubmit, updateUserProfile, uploadImage } from "../../../pages/api";
import { IPostSubmitData, IProfileImageUpdateData } from "../../typeScript";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userProfileImageUpdate } from "../../../redux/actions/authActions";

const ProfileImageUpdateModal: NextPage = ({
  dashboardTrue,
  setProfileImageUpdateModal,
  userProfileUrl
}: any) => {
  const [postSubmitData, setPostSubmitData] = useState<IProfileImageUpdateData>(
    {
      userProfileImage: {
        url: "",
        public_id: "",
      },
    }
  );

  const router = useRouter();
  const dispatch: any = useDispatch();

  // // console.log(postSubmitData.description)

  // get token from state
  const token = useSelector((state: any) => state.authUser.token);

  // get user image url from store
  // const userProfileImageUrlfromStore = useSelector(
  //   (state: any) => state.authUser.currentUser?.userProfileImage?.url
  // );

  // Handle Image Upload
  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    // // console.log([...formData]);
    try {
      const { data } = await uploadImage(formData, token);
      // // console.log(data);
      setPostSubmitData({ ...postSubmitData, userProfileImage: data });
      // // console.log(postSubmitData.image);
    } catch (error) {
      // console.log("Error=> ", error);
    }
  };

  // handle Profile update
  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    // // console.log("clicked");
    // // console.log(postId);

    try {
      const { data } = await updateUserProfile(postSubmitData, token);
      // console.log(data);
      if (data.profileImageUpdate == "true") {
        setProfileImageUpdateModal(false);
        const user = data.user;
        // // console.log(user);
        // // console.log(data.userProfileImageData);
        toast.success("Your profile image is updated");
        router.push("/dashboard/user");

        // Update Redux User Profile Store
        dispatch(userProfileImageUpdate(user));
        // dispatch(authUser(userProfileImageData))
      }
    } catch (error) {
      // console.log("Error=> ", error);
    }
  };

  return (
    <>
      {/* Post Form Start */}
      <BackgroundGray dashboardTrue={dashboardTrue} />
      <div
        style={{ width: "40rem" }}
        className="fixed ml-auto mr-auto left-0 right-0 bg-white  top-20  z-[9999] rounded-lg shadow-2xl"
      >
        <div className="flex  justify-between  mx-10 mt-3">
          <div className="mt-2 text-xl font-semibold ">Update Profile</div>

          <div>
            <button
              // onClick={() => handlePostModal(false)}
              onClick={() => setProfileImageUpdateModal(false)}
              className="focus:outline-none"
            >
              <HiOutlineX className="h-8 w-8 text-gray-400 bg-white shadow-md p-1 rounded-full " />
            </button>
          </div>
        </div>

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
            {postSubmitData.userProfileImage &&
            postSubmitData.userProfileImage.url ? (
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

            {/* image Preview check*/}
            {postSubmitData.userProfileImage &&
            postSubmitData.userProfileImage.url ? (
              <Image
                //  loader={myLoader}
                src={postSubmitData.userProfileImage.url}
                alt=""
                height={150}
                width={150}
                className=""
              />
            ) : // Check Profile if alredy exist
            userProfileUrl ? (
              <Image
                src={userProfileUrl}
                alt=""
                height={100}
                width={100}
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

        {/* Submit button */}
        <div className="flex justify-center items-center mt-0.5 ">
          <button
            type="submit"
            onClick={handleUpdateProfile}
            className="border focus:outline-none bg-gray-900 text-white rounded-2xl shadow-xl px-6   py-3 font-bold m-3 hover: transform hover:scale-110  hover:shadow-xl "
          >
            Update
          </button>
        </div>
      </div>

      {/* Post Form  End*/}
    </>
  );
};

export default ProfileImageUpdateModal;
