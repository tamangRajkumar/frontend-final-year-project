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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!showProfileDropdown) return;
      const btn = profileDropdownBtnRef.current as Node | null;
      const dd = dropdownRef.current as Node | null;
      if (btn && btn.contains && btn.contains(target)) return;
      if (dd && dd.contains && dd.contains(target)) return;
      setShowProfileDropdown(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showProfileDropdown]);

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

  const brand = '#f26722';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40">
        {/* Glassy navbar */}
        <nav className="backdrop-blur-sm bg-white/60 border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <div className="flex items-center space-x-4">
                  {navMenuItems.map((item) => (
                    <div key={item.name} className="relative">
                      <Link href={item.link}>
                        <a
                          className={
                            router.pathname == item.link
                              ? "text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                              : "text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition"
                          }
                        >
                          {item.name}
                        </a>
                      </Link>
                      {router.pathname == item.link && (
                        <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 h-1 w-10 rounded-full"
                          style={{ background: `linear-gradient(90deg, ${brand}, #ff8f57)` }} />
                      )}
                    </div>
                  ))}

                  {/* Minimal search */}
                  <div className="ml-3 flex items-center">
                    <div className="relative">
                      <input
                        placeholder="Search"
                        className="hidden md:block w-48 pl-3 pr-8 py-1 rounded-full border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                      <HiSearch className="absolute right-1 top-1.5 h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              {authUser && (
                <>
                  {/* Favorite Lists */}
                  <div className="hidden lg:block mx-3">
                    <Link href="/favorite_posts">
                      <HiHeart className="h-7 w-7 text-red-600 cursor-pointer transition hover:scale-105" />
                    </Link>
                  </div>

                  {/* Add new Post button icon  */}
                  <div
                    onClick={handlePostModal}
                    className="ml-1 hidden lg:block"
                  >
                    <div className="p-2 rounded-lg bg-white/70 border border-gray-200 shadow hover:shadow-lg transition cursor-pointer">
                      <HiPlus className="h-5 w-5 text-gray-900" />
                    </div>
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
                    <div className="relative mr-3">
                      <button
                        type="button"
                        className="rounded-full bg-white/80 p-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        {/* View notifications bell  */}
                        <HiBell
                          className="h-6 w-6 p-0.5 "
                          fill="none"
                          strokeWidth="1.5"
                        />
                      </button>
                      {/* notification count badge */}
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white rounded-full"
                        style={{ background: brand }}>
                        3
                      </span>
                    </div>
                  </>
                )}
                {/* Profile dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button
                      ref={profileDropdownBtnRef}
                      className="flex ml-2 rounded-full bg-white/80 p-1.5 text-sm focus:outline-none border border-gray-200 shadow hover:shadow-lg transition"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      onClick={handleshowProfileDropdown}
                    >
                      {profileUrl ? (
                        <>
                         <img
                            className="h-9 w-9 rounded-full object-cover"
                            src={profileUrl}
                            alt=""
                          />
                        </>
                      ) : (
                        <>
                          <img
                            className="h-9 w-9 rounded-full shadow-md object-cover"
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
