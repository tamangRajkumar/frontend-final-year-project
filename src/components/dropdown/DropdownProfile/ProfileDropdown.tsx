import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../../../redux/actions/authActions";
import { toast } from "react-toastify";

const ProfileDropdown = ({ showProfileDropdown, onClose, dropdownRef }: any) => {
  
  //check whether the user is logged in or not if logged in and isAuthenticated is true
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

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

  // Get role-based profile data
  const getProfileDropdownData = () => {
    const baseData = [
      {
        name: "Setting",
        link: "/setting/profile_setting",
      },
    ];

    if (currentUser?.role === 'admin') {
      return [
        {
          name: "Admin Dashboard",
          link: "/dashboard/admin",
        },
        ...baseData,
      ];
    } else if (currentUser?.role === 'business') {
      return [
        {
          name: "Business Dashboard",
          link: "/dashboard/business",
        },
        ...baseData,
      ];
    } else {
      return [
        {
          name: "Your Profile",
          link: "/dashboard/user",
        },
        ...baseData,
      ];
    }
  };

  const ProfileDropdownDataLoggedIn = getProfileDropdownData();


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
            ref={dropdownRef}
            className="dropDownMenu absolute right-0 bottom-[-7rem] z-50 mt-2 w-56 origin-top-right rounded-xl bg-white border border-gray-200 py-1 shadow-lg focus:outline-none transform transition-all duration-150 ease-out"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabIndex={-1}
            style={{ animation: 'dropdownIn 160ms ease forwards' }}
          >
            {/* Items */}
            {authUser
              ? // If user is logged in dropdown for user
                ProfileDropdownDataLoggedIn.map((data, idx) => (
                  <div key={data.name} className="z-50">
                    <Link href={data.link}>
                      <a
                        onClick={() => onClose && onClose()}
                        className={
                          router.pathname == data.link
                            ? "flex items-center justify-between px-4 py-2 text-sm text-gray-800 bg-white/30 font-medium"
                            : "flex items-center justify-between px-4 py-2 text-sm text-gray-800 hover:bg-white/30 transition"
                        }
                        role="menuitem"
                        tabIndex={-1}
                      >
                        <span>{data.name}</span>
                        {data.name === 'Your Profile' && <span className="text-xs text-gray-500">Profile</span>}
                        {data.name === 'Admin Dashboard' && <span className="text-xs text-gray-500">Admin</span>}
                        {data.name === 'Business Dashboard' && <span className="text-xs text-gray-500">Business</span>}
                      </a>
                    </Link>
                  </div>
                ))
              : // if user is not logged in dropdown for user
                ProfileDropdownDataNotLoggedIn.map((data) => (
                  <div key={data.name} className="z-50">
                    <Link href={data.link}>
                      <a
                        onClick={() => onClose && onClose()}
                        className={
                          router.pathname == data.link
                            ? "block px-4 py-2 text-base text-gray-800 bg-white/30 font-medium"
                            : "block px-4 py-2 text-base text-gray-800 hover:bg-white/30 transition"
                        }
                        role="menuitem"
                        tabIndex={-1}
                      >
                        {data.name}
                      </a>
                    </Link>
                  </div>
                ))}

            {authUser && (
              <div>
                <span
                  onClick={() => {
                    handleLogOut();
                    onClose && onClose();
                  }}
                  className=" block mt-1 px-4 py-2 text-sm text-gray-800 hover:bg-white/30 transition cursor-pointer font-medium"
                  role="menuitem"
                  tabIndex={-1}
                >
                  Sign Out
                </span>
              </div>
            )}

            <style jsx>{`
              @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
              @keyframes dropdownOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-6px) scale(0.98); } }
            `}</style>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileDropdown;
