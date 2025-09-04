import React from "react";

const   OptionsDropdown = ({ showOptionsDropdown }: any) => {


  return (
    <>
      {showOptionsDropdown && (
        <div className="relative">
          <div className="absolute z-40 right-0 bg-white border-[1px] shadow-xl  pl-2 pr-5 pt-3 pb-2 rounded-xl space-y-1 ">
            <p>Edit</p>
            <p>Delete</p>
            <p>Add to Favorite</p>
            <p>Report Post</p>
            </div>
        </div>
      )}
    </>
  );
};

export default OptionsDropdown;
