import React from "react";
import Image from "next/image";
import { Image1, Profile } from "../../../assets";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Link from "next/link";

const UserPosts = () => {
  return (
    <div className=" w-[90vh]  p-2 rounded-md  shadow-md bg-white">
      <div className="flex justify-between items-center">
        <div className="flex">
          {/* Profile Image */}
          <Image
            src={Profile}
            alt="Picture of the author"
            width={50}
            height={50}
            className="rounded-full object-cover cursor-pointer"
          />

          {/* Name and time */}
          <div className="ml-3">
            <p className="text-base font-medium cursor-pointer">Name</p>
            <p className="text-base ">Time</p>
          </div>
        </div>

        {/* Options button */}
        <div>
          <HiOutlineDotsHorizontal className="h-6 w-6 cursor-pointer" />
        </div>
      </div>

      {/* Posted Image  */}

      <Link href="/individual-post">
      <div className="flex justify-center items-center relative   h-[60vh] ">
        <Image
          src={Image1}
          alt="Picture of the user"
          layout="fill"
          objectFit="contain"
          className="cursor-pointer"
        />
      </div>
      </Link>


      {/* Like and comment */}
      <div className="flex justify-between mx-5 items-center">
        <p className="cursor-pointer">Like</p>
        <p className="cursor-pointer">comment</p>
        <p className="cursor-pointer">Share</p>
      </div>
    </div>
  );
};

export default UserPosts;
