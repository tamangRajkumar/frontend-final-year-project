import React from "react";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";

const ProfileSetting = () => {
  return (
    <div className="flex   px-20  h-[100vh] bg-white">
      {/* Sidebar Setting Options */}
      <SidebarSettingOptions />

      {/* Edit Layout */}
      <div className="ml-16 space-y-10  flex flex-col flex-grow mt-20 ">
        {/* Name Edit */}
        <div className="flex justify-between items-center ">
          <div className="flex ">
            <p className="font-semibold text-lg w-[10vw]">Name </p>
            <p className="font-medium text-base">Rajkumar Tmg</p>
          </div>
          <div>
            <button className="px-2 py-1 bg-gray-300 rounded-lg text-base font-normal">
              {" "}
              Edit
            </button>
          </div>
        </div>

        {/* Address Edit  */}
        <div className="flex justify-between items-center">
          <div className="flex ">
            <p className="font-semibold text-lg w-[10vw]">Country </p>
            <p className="font-medium text-base">Nepal</p>
          </div>
          <div>
            <button className="px-2 py-1 bg-gray-300 rounded-lg text-base font-normal">
                        Edit
            </button>
          </div>
        </div>

         {/* Gender Edit */}
         <div className="flex justify-between items-center ">
          <div className="flex ">
            <p className="font-semibold text-lg w-[10vw]">Gender </p>
            <p className="font-medium text-base">Male</p>
          </div>
          <div>
            <button className="px-2 py-1 bg-gray-300 rounded-lg text-base font-normal">
                       Edit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSetting;
