import React from "react";
import { NextPage } from "next";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";

const KYCTest: NextPage = () => {
  return (
    <div className="flex px-20 h-[100vh] bg-white">
      <SidebarSettingOptions />
      <div className="ml-16 flex flex-col flex-grow mt-20">
        <h1>KYC Test Page</h1>
        <p>This is a test page to check if the basic structure works.</p>
      </div>
    </div>
  );
};

export default KYCTest;
