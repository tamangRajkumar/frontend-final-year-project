import React, { useState } from "react";
import type { NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logInUser } from "../../redux/actions/authActions";
import Image from "next/image";
import { Image1 } from "../../src/assets";
import Link from "next/link";

const login: NextPage = () => {
  const [userLogInData, setUserLogInData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const dispatch: any = useDispatch();

  //check whether the user is logged in or not if logged in and isAuthenticated is true then redirect to dashboard
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  if (authUser == true) {
    router.push("/dashboard/user");
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(userLogInData);
    try {
      dispatch(logInUser(userLogInData, router));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" flex justify-around mt-24 mb-20 ">
        {/* Posted Image  */}
        <div className="flex  w-[90vh]     ">
          <Image
            src={Image1}
            alt="Picture of the user"
            // layout="fill"
            // objectFit="contain"
            className="cursor-pointer"
          />
        </div>

        <div className=" flex-cols mt-14 justify-center items-center">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Log in</h1>
          </div>
          <form>
            <div className="my-5 ">
              {/* <label htmlFor="email">Email</label> */}
              <input
                type="email"
                value={userLogInData.email}
                onChange={(e) =>
                  setUserLogInData({ ...userLogInData, email: e.target.value })
                }
                placeholder="Email"
                className="py-1.5 px-10 shadow-md rounded-2xl outline-none text-center"
              />
            </div>
            <div className="mb-5 flex  justify-center items-center ">
              {/* <label htmlFor="password">Password</label> */}
              <input
                type="password"
                value={userLogInData.password}
                onChange={(e) =>
                  setUserLogInData({
                    ...userLogInData,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
                className="py-1.5 px-5 shadow-md rounded-2xl outline-none text-center"
              />
            </div>
            <div className="flex justify-center items-center">
              <button type="submit" onClick={handleSubmit}>
                <p className="text-md font-bold bg-black text-white px-5 pt-1 pb-2 rounded-xl shadow-md">
                  Log in
                </p>
              </button>
            </div>

            {/* Sign Up Redirect */}
            <div className="flex space-x-2 mt-5 justify-center items-center">
              <p>Not yet Signed up? </p>
              <Link href="/auth/signup">
                <a className="text-red-400 underline underline-offset-4 cursor-pointer">
                  sign up
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default login;
