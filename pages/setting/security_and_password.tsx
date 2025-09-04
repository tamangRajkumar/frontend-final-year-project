import React from "react";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";

const security_and_password = () => {
  return (
    <div className="flex   px-20 h-[100vh] bg-white">
      {/* Sidebar Setting Options */}
      <SidebarSettingOptions />

      {/* Edit Layout */}
      <div className="ml-16 space-y-10  flex flex-col flex-grow mt-20  ">
        <div className="flex justify-between items-center ">
          {/* Email Edit */}
          <div className="flex ">
          <p className="font-semibold text-lg w-[10vw]">email </p>
          <p className="font-medium text-base">rajkumar@gmail.com</p>
          </div>
          <div>
            <button className="px-2 py-1 bg-gray-300 rounded-lg text-base font-normal"> Edit</button>
          </div>
        </div>

          {/* Password Edit  */}
        <div className="flex justify-between mt-5 items-center">
          <div className="flex ">
          <p className="font-semibold text-lg w-[10vw]">Password </p>
          <p className="font-medium text-base">********</p>
          </div>
          <div>
            <button className="px-2 py-1 bg-gray-300 rounded-lg text-base font-normal"> Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default security_and_password;
