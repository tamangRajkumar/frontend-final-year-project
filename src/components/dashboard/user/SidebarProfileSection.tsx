import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Avatar, Profile } from "../../../assets";
import moment from "moment";
import { HiPencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import ProfileImageUpdateModal from "../../Modal/ProfileImageUpdateModal";

const SidebarProfileSection = ({ userData }: any) => {
  const [authUser, setAuthUser] = useState();
  const [profileImageUpdateModal, setProfileImageUpdateModal] =
    useState<any>(false);

  // get user image url from store
  // const userProfileImageUrlfromStore = useSelector(
  //   (state: any) => state.authUser.currentUser?.userProfileImage?.url
  // );

    //check whether the user is logged in or not if logged in and isAuthenticated is true
    const userAuth = useSelector((state: any) => state.authUser.isAuthenticated);
    useEffect(() => {
      setAuthUser(userAuth);
    });
  


  // get user from local Storage
  const user= userAuth &&  typeof window !== "undefined"  && JSON.parse(localStorage.getItem("user") ||'');
  // console.log(user?.userProfileImage?.url);
  const profileUrl=user?.userProfileImage?.url;

  // console.log(userProfileImageUrlfromStore);

  // update user Profile image
  const updateUserProfileImage = () => {
    setProfileImageUpdateModal(true);
  };

  return (
    <>
      <div className="px-10 py-10 w-[25vw]  ">
        <div className=" sticky top-32 ">
          {/* Profile Image */}
          <div className="relative">
            {/* Profile image edit button */}
            <div onClick={() => updateUserProfileImage()} className="">
              <HiPencil className="absolute h-7 w-7 top-0 left-20  z-10  text-gray-400 cursor-pointer bg-white  p-1 shadow-md rounded-full " />
            </div>

            {profileUrl ? (
              <Image
                src={profileUrl}
                alt="Picture of the author"
                width={100}
                height={100}
                className="rounded-full object-cover cursor-pointer"
              />
            ) : (
              <Image
                src={Avatar}
                alt="Picture of the author"
                width={100}
                height={100}
                className="rounded-full object-cover cursor-pointer"
              />
            )}
          </div>

          <div className="mt-3 space-y-2">
            <p className="font-bold ">
              <span className="mr-2">{userData?.fname}</span>
              <span>{userData?.lname}</span>
            </p>
            <p>
              <span className="font-semibold text-base">From: </span>
              <span>{userData?.country}</span>
            </p>
            <p>
              <span className="font-semibold text-base">Joined Date: </span>
              <span>{moment(userData?.createdAt).calendar()}</span>
            </p>
          </div>

          {/* Goals Section */}
          {userData?.goals && userData.goals.length > 0 && (
            <div className="mt-6">
              <p className="font-bold text-gray-900 mb-2">Goals</p>
              <div className="space-y-1">
                {userData.goals.slice(0, 3).map((goal: string, index: number) => (
                  <p key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="line-clamp-2">{goal}</span>
                  </p>
                ))}
                {userData.goals.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{userData.goals.length - 3} more goals
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {userData?.skills && userData.skills.length > 0 && (
            <div className="mt-6">
              <p className="font-bold text-gray-900 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1">
                {userData.skills.slice(0, 6).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {userData.skills.length > 6 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{userData.skills.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* <div className="mt-10">
            <p className="font-bold">My Favorite Places</p>
            <div>
              <p>
                <span>#</span>Nepal
              </p>
              <p>
                <span>#</span>Japan
              </p>
              <p>
                <span>#</span>USA
              </p>
            </div>
          </div> */}

          {/* <div className="mt-10">
        <p className="font-bold">Hobbies</p>
        <div>
          <p>
            <span>#</span>Football
          </p>
          <p>
            <span>#</span>Table Tennis
          </p>
          <p>
            <span>#</span>Chess
          </p>
        </div>
      </div> */}
        </div>
      </div>
      {
        // Profile Image Update Modal
        profileImageUpdateModal && (
          <ProfileImageUpdateModal
            setProfileImageUpdateModal={setProfileImageUpdateModal}
            dashboardTrue={true}
            userProfileUrl={profileUrl}
           

          />
        )
      }
    </>
  );
};

export default SidebarProfileSection;
