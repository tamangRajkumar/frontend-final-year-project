import React from "react";
import Image from "next/image";
import { Avatar, Image1 } from "../../assets";
import Link from "next/link";

const Card = ({ users }: any) => {

  //hanlde user profile view
  const handleUserProfileView = (userId: any) => {
    console.log(userId);
  };

  return (
    <>
      {users?.map((user: any) => {
        return (
          <>
            <div
              key={user?._id}
              className="mx-10 flex flex-col bg-white pt-5 pb-3 px-3 shadow-lg rounded-xl my-5 "
            >
              {/* user Image */}
              {user?.userProfileImage?.url ? (
                <Image
                  src={user?.userProfileImage?.url}
                  alt="Picture of the user"
                  // layout="fill"
                  height={150}
                  width={150}
                  objectFit="contain"
                  className="cursor-pointer  "
                />
              ) : (
                <Image
                  src={Avatar}
                  alt="Picture of the user"
                  // layout="fill"
                  height={150}
                  width={150}
                  objectFit="contain"
                  className="cursor-pointer "
                />
              )}

              <div className="flex text-lg mt-2 font-semibold justify-center items-center">
                <p className="mr-1  ">{user?.fname}</p>
                <p>{user?.lname}</p>
              </div>

              {/* View Profile Button */}
              
                <div className="flex justify-center items-center mt-3 "
                onClick={()=>handleUserProfileView(user?._id)}
                >
                  <div className=" bg-gray-300  px-5 py-1 rounded-lg  cursor-pointer">
                    <p>View Profile</p>
                  </div>
                </div>
             
            </div>
          </>
        );
      })}
    </>
  );
};

export default Card;
