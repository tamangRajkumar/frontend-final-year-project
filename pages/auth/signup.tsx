import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { signUp } from "../api";
import { useRouter } from "next/router";
import Image from "next/image";
import { Image1 } from "../../src/assets";
import { useSelector } from "react-redux";
import Link from "next/link";
import { countriesData } from "../api";
import { toast } from "react-toastify";

const signup: NextPage = () => {
  const [signUpData, setSignUpData] = useState({
    fname: "",
    lname: "",
    country: "",
    gender: "",
    email: "",
    password: "",
    userProfileImage: {
      url: "",
      public_key: "",
    },
    userCoverImage: {
      url: "",
      public_key: "",
    },
    favoritePostsList: [],
  });

  console.log(signUpData.country);
  console.log(signUpData.gender);

  const [countries, setCountries] = useState<any[]>([]);
  // console.log(countries)

  const router = useRouter();

  //check whether the user is logged in or not if logged in and isAuthenticated is true then redirect to dashboard
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  if (authUser == true) {
    router.push("/dashboard/user");
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(signUpData);
    try {
      const { data } = await signUp(signUpData);
      console.log(data);
      if (data.ok) {
        router.push("/auth/login");
        toast.success("Successfully signed up, Please log in.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sign Up failed, Please try again!");
    }
  };

  // Fetch countries name api
  useEffect(() => {
    fetchCountriesData();
  }, []);

  const fetchCountriesData = async () => {
    try {
      const { data } = await countriesData();
      console.log(
        data?.data.map((c: any) => {
          return c.country;
        })
      );
      setCountries(data?.data);
    } catch (error) {
      console.log("Error=>", error);
    }
  };

  return (
    <>
      <div className=" flex justify-around mt-16 mb-20 ">
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

        <div className=" flex-cols mt-5 justify-center items-center">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Sign Up</h1>
          </div>
          <form>
            {/* Full name fields */}
            <div className="flex justify-center items-center space-x-6">
              {/* First Name Field */}
              <div className="my-5 flex justify-center">
                {/* <label htmlFor="email">Email</label> */}
                <input
                  type="text"
                  value={signUpData.fname}
                  onChange={(e) => {
                    const fname =
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1).toLowerCase();

                    setSignUpData({ ...signUpData, fname });
                  }}
                  placeholder="First Name"
                  className="py-1.5 px-2 shadow-md rounded-2xl outline-none text-center"
                />
              </div>

              {/* Last Name Field */}
              <div className="my-5 flex justify-center ">
                {/* <label htmlFor="email">Email</label> */}
                <input
                  type="text"
                  value={signUpData.lname}
                  onChange={(e) => {
                    const lname =
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1).toLowerCase();

                    setSignUpData({ ...signUpData, lname });
                  }}
                  placeholder="Last Name"
                  className="py-1.5 px-6 shadow-md rounded-2xl outline-none text-center"
                />
              </div>
            </div>

            {/* Choose country Field */}
            <div className=" mt-2 flex flex-col justify-center items-center ">
              <select
                name="country"
                value={signUpData.country}
                onChange={(e) => {
                  setSignUpData({
                    ...signUpData,
                    country: e.target.value,
                  });
                }}
                className="text-gray-400 px-3 w-[30vh] py-1 focus:outline-none shadow-md border-gray-300 rounded-xl cursor-pointer"
              >
                <option>Select your country</option>
                {countries?.map((data: any, i: number) => {
                  return (
                    <option key={i} value={data.country}>
                      {data.country}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Select gender options */}
            <div className=" mt-5 flex flex-col justify-center items-center ">
              <select
                name="gender"
                value={signUpData.gender}
                onChange={(e) => {
                  setSignUpData({
                    ...signUpData,
                    gender: e.target.value,
                  });
                }}
                className="text-gray-400 px-3 w-[20vh] py-1 focus:outline-none shadow-md border-gray-300 rounded-xl cursor-pointer"
              >
                <option>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Email Field */}
            <div className="my-5 flex justify-center items-center ">
              {/* <label htmlFor="email">Email</label> */}
              <input
                type="email"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
                placeholder="Email"
                className="py-1.5 px-10 shadow-md rounded-2xl outline-none text-center"
              />
            </div>

            {/* Password field */}
            <div className="mb-5 flex  justify-center items-center ">
              {/* <label htmlFor="password">Password</label> */}
              <input
                type="password"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
                placeholder="Password"
                className="py-1.5 px-5 shadow-md rounded-2xl outline-none text-center"
              />
            </div>
            <div className="flex justify-center items-center">
              <button type="submit" onClick={handleSubmit}>
                <p className="text-md font-bold bg-black text-white px-5 pt-1 pb-2 rounded-xl shadow-md">
                  Sign Up
                </p>
              </button>
            </div>

            {/* Login Redirect */}
            <div className="flex space-x-2 mt-5 justify-center items-center">
              <p>Already Signed up?</p>
              <Link href="/auth/login">
                <a className="text-red-400 underline underline-offset-4 cursor-pointer">
                  Log in
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default signup;
