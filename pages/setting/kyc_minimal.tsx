import React from "react";
import { NextPage } from "next";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";

const KYCMinimal: NextPage = () => {
  return (
    <div className="flex px-20 h-[100vh] bg-white">
      <SidebarSettingOptions />
      <div className="ml-16 flex flex-col flex-grow mt-20">
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification (Minimal)</h1>
        <p className="text-gray-600 mt-1">This is a minimal test page.</p>
      </div>
    </div>
  );
};

export default KYCMinimal;

