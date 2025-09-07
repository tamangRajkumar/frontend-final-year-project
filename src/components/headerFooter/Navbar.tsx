import React, { useState, useEffect, useRef } from "react";
import DropdownMobileView from "../dropdown/MobileView/DropdownMobileView";
import type { NextPage } from "next";

import { HiOutlineX, HiOutlineMenu, HiPlus, HiBell, HiSearch } from "react-icons/hi";
import Link from "next/link";
import ProfileDropdown from "../dropdown/DropdownProfile/ProfileDropdown";
import { HiHeart } from "react-icons/hi";
import { useRouter } from "next/router";
import PostModalDashboard from "../Modal/PostModalDashboard";
import { useSelector } from "react-redux";
import Image from "next/image";

const Navbar: NextPage = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileViewDropdown, setShowMobileViewDropdown] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [profileUrl, setProfileUrl] = useState();

  const [authUser, setAuthUser] = useState();
  //check whether the user is logged in or not if logged in and isAuthenticated is true
  const userAuth = useSelector((state: any) => state.authUser.isAuthenticated);
  useEffect(() => {
    setAuthUser(userAuth);
  });

  // get user from local Storage to get profile url
  // why from local storage -> to stop whole website rerendering
  const user =
  userAuth &&  typeof window !== "undefined" &&
    JSON.parse(window.localStorage.getItem("user") || "");
  // console.log(user?.userProfileImage?.url);
  const getProfileUrl = user?.userProfileImage?.url;

  useEffect(() => {
    setProfileUrl(getProfileUrl);
  });

  const router = useRouter();
  const profileDropdownBtnRef = useRef(null);

  const handleshowProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleShowMobileViewDropdown = () => {
    setShowMobileViewDropdown((prev) => !prev);
  };

  // Handle Hide show post modal
  const handlePostModal = () => {
    setPostModal(true);
  };

  // Close Profile Dropdown on mouse clicked event
  // useEffect(() => {
  //   const closeProfileDropdownOnClick = (e: any) => {
  //     // setIsMobileViewDropdown(false)
  //     // console.log(e.path[1]);
  //     // console.log(profileDropdownBtnRef.current)
  //     if (e?.path?.[1] !== profileDropdownBtnRef.current) {
  //       setShowProfileDropdown(false);
  //       // console.log(e);
  //     }
  //   };
  //   document.body.addEventListener("click", closeProfileDropdownOnClick);

  //   return () =>
  //     document.body.removeEventListener("click", closeProfileDropdownOnClick);
  // }, []);

  const navMenuItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Posts",
      link: "/posts",
    },
    {
      name: "Proposals",
      link: "/proposals",
    },
    {
      name: "Events",
      link: "/events",
    },
    {
      name: "Chat",
      link: "/chat",
    },
    {
      name: "Explore Events",
      link: "/explore_events",
    },
    {
      name: "Find Users",
      link: "/find_users",
    },
  ];

  return (
    <>
      <div className="sticky top-0  z-30 w-[100%] ">
        {/* This example requires Tailwind CSS v2.0+ */}
        <nav className="bg-white shadow-md py-2">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400
                   hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-700"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  onClick={handleShowMobileViewDropdown}
                >
                  <span className="sr-only">Open main menu</span>

                  {/* Mobile View Menu toggle */}
                  {showMobileViewDropdown ? (
                    <>
                      {/* Mobile menu close icon */}
                      <HiOutlineX className=" h-6 w-6" />
                    </>
                  ) : (
                    <>
                      {/* Mobile menu open icon */}
                      <HiOutlineMenu className=" h-6 w-6" />
                    </>
                  )}
                </button>
              </div>

              {/* Company Logo */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  {/* Mobile View */}
                  <Link href="/">
                    {/* <img
                      className="block h-8 w-auto lg:hidden cursor-pointer"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    /> */}
                    <p className="block h-8 w-auto lg:hidden cursor-pointer font-bold text-xl">
                      LinkCofounders
                    </p>
                  </Link>

                  {/* Web View */}
                  <Link href="/">
                    {/* <img
                      className="hidden h-8 w-auto lg:block cursor-pointer"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    /> */}
                    <p className="hidden h-8 w-auto lg:block cursor-pointer font-bold text-xl">
                      LinkCofounders
                    </p>
                  </Link>
                </div>
              </div>

              {/* Web View Nav Links */}
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}

                  {navMenuItems.map((item) => (
                    <div key={item.name}>
                      <Link href={item.link}>
                        <a
                          className={
                            router.pathname == item.link
                              ? "bg-gray-900 text-white px-3 py-2 rounded-lg text-base font-medium shadow-sm"
                              : "text-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-sm px-3 py-2 rounded-lg text-base font-medium shadow-sm ease-in-out duration-150"
                          }
                        >
                          {item.name}
                        </a>
                      </Link>
                    </div>
                  ))}

                  {/* <Link href="explore_places">
                    <a className="text-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-sm px-3 py-2 rounded-lg text-md font-medium shadow-sm ">
                      Explore Places
                    </a>
                  </Link> */}
                </div>
              </div>

              {authUser && (
                <>
                  {/* Favorite Lists */}
                  <div className="hidden lg:block mx-4">
                    <Link href="/favorite_posts">
                      <HiHeart className="h-8 w-8 text-red-600 cursor-pointer " />
                    </Link>
                  </div>

                  {/* Add new Post button icon  */}
                  <div
                    onClick={handlePostModal}
                    className="bg-white cursor-pointer  ml-1 shadow-md p-1 rounded-lg hidden lg:block"
                  >
                    <HiPlus className="h-6  w-6 text-gray-900" />
                  </div>

                  {/* Post Modal Show Hide */}
                  {postModal && (
                    <PostModalDashboard
                      dashboardTrue={true}
                      editPost={false}
                      setPostModal={setPostModal}
                    />
                  )}
                </>
              )}

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* View Notifications   */}
                {authUser && (
                  <>
                    <button
                      type="button"
                      className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      {/* View notifications bell  */}
                      <HiBell
                        className="h-6 w-6 p-0.5 "
                        fill="none"
                        strokeWidth="1.5"
                      ></HiBell>
                    </button>
                  </>
                )}
                {/* Profile dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button
                      ref={profileDropdownBtnRef}
                      className="flex ml-2 rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      onClick={handleshowProfileDropdown}
                    >
                      {profileUrl ? (
                        <>
                         <img
                            className="h-9 w-9 rounded-full"
                            src={profileUrl}
                            alt=""
                          />  
                        </>
                      ) : (
                        <>
                          <img
                            className="h-10  w-10 rounded-full shadow-md"
                            src="https://res.cloudinary.com/dltfhwsui/image/upload/v1665376261/Avatar_nvh0hb.png"
                            alt=""
                          />
                        </>
                      )}
                    </button>
                  </div>
                  {/* Profile Dropdown */}
                  <ProfileDropdown showProfileDropdown={showProfileDropdown} />
                </div>
              </div>
            </div>
          </div>
          {/* Mobile menu, show/hide based on menu state. */}
          <DropdownMobileView showMobileViewDropdown={showMobileViewDropdown} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
