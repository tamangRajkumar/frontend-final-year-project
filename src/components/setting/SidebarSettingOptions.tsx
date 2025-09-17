import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { icons } from "react-icons";
import { HiOutlineLockClosed, HiOutlineUserCircle, HiOutlineDocumentText } from "react-icons/hi";

const SidebarSettingOptions = () => {
  const sideBarSettingOptionsData = [
    {
      name: "Profile Setting",
      link: "/setting/profile_setting",
      icon: <HiOutlineUserCircle className="h-6 w-6 text-gray-600" />,
    },
    {
      name: "KYC Verification",
      link: "/setting/kyc_verification",
      icon: <HiOutlineDocumentText className="h-6 w-6 text-gray-600" />,
    },
    {
      name: "Security and password",
      link: "/setting/security_and_password",
      icon: <HiOutlineLockClosed className="h-6 w-6 text-gray-600" />,
    },
  ];

  const router = useRouter();

  return (
    <div className="w-[40vw] flex flex-col space-y-10 pt-20 pr-[10vw] border-r-1 border-b-1 shadow-md pl-10 ">
      <p className="font-bold text-xl">Settings</p>
      <div className="flex flex-col ml-10 space-y-5">
        {sideBarSettingOptionsData.map((data) => {
          return (
            <div key={data.name}>
              <div
                className={
                  data.link == router.pathname
                    ? "flex  items-center pl-2 rounded-xl bg-gray-200 "
                    : "flex  items-center pl-2"
                }
              >
                {data.icon}
                <Link href={data.link}>
                  <a className="font-semibold text-base py-3 pr-10 pl-3">
                    {" "}
                    {data.name}
                  </a>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarSettingOptions;
