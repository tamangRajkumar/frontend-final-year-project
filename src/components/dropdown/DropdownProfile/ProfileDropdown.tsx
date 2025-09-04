import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../../../redux/actions/authActions";
import { toast } from "react-toastify";

const ProfileDropdown = ({ showProfileDropdown }: any) => {
  
  //check whether the user is logged in or not if logged in and isAuthenticated is true
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);


  //dropdown Datas For not logged in user
  const ProfileDropdownDataNotLoggedIn = [
    {
      name: "Log In",
      link: "/auth/login",
    },
    {
      name: "Sign Up",
      link: "/auth/signup",
    },
  ];

  // dropdown datas for logged in users
  const ProfileDropdownDataLoggedIn = [
    {
      name: "Your Profile",
      link: "/dashboard/user",
    },
    {
      name: "Setting",
      link: "/setting/profile_setting",
    },
  ];


  const router = useRouter();
  const dispatch:any = useDispatch();


  // const isAuthenticated = useSelector(
  //   (state:any) => state.authUser.isAuthenticated
  // );

  

  const userLogOut = {};

  // const userProfileData = {
  //   url: "",
  // };
  const handleLogOut = () => {
    // remove token from local strorage
    window.localStorage.removeItem("token");
    // console.log("userlog out called");
    // remove user data from local storage
    window.localStorage.removeItem("user");
    // remove favorite Posts list 
    window.localStorage.removeItem("favoritePostsList");
    // window.localStorage.removeItem("userProfileData");
    dispatch(logOutUser(userLogOut));
    // dispatch(userProfileUpdate(userProfileData));

    toast.success("Logged out successfully");
    router.push("/auth/login");
  };



  return (
    <>
      {showProfileDropdown && (
        <>
          {/*
      Dropdown menu, show/hide based on menu state.
s
      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    */}
          <div
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 
            shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-700  "
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabIndex={-1}
          >
            {/* Active: "bg-gray-100", Not Active: "" */}

            {authUser
              ? // If user is logged in dropdown for user
                ProfileDropdownDataLoggedIn.map((data) => {
                  return (
                    <div key={data.name}>
                      <Link href={data.link}>
                        <a
                          className={
                            router.pathname == data.link
                              ? "block px-4 py-2 text-base text-gray-700 bg-gray-200"
                              : "block px-4 py-2 text-base text-gray-700 hover:bg-gray-200"
                          }
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-0"
                        >
                          {data.name}
                        </a>
                      </Link>
                    </div>
                  );
                })
              : // if user is not logged in dropdown for user
                ProfileDropdownDataNotLoggedIn.map((data) => {
                  return (
                    <div key={data.name}>
                      <Link href={data.link}>
                        <a
                          className={
                            router.pathname == data.link
                              ? "block px-4 py-2 text-base text-gray-700 bg-gray-200"
                              : "block px-4 py-2 text-base text-gray-700 hover:bg-gray-200"
                          }
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-0"
                        >
                          {data.name}
                        </a>
                      </Link>
                    </div>
                  );
                })}

            {authUser && (
              <div onClick={handleLogOut} className="cursor-pointer" >
                <span
                  className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-200"
                  role="menuitem"
                  tabIndex={-1}
                  id="user-menu-item-0"
                >
                  Sign Out
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProfileDropdown;
