import React from "react";

const BackgroundGray = ({
  dashboardTrue,
  isNavMobileViewDropdown,
  setIsMobileViewDropdown,
}:any) => {
  // console.log(dashboardTrue)
  return (
    <>
      {/* Background gray  */}

      <button
        onClick={() => isNavMobileViewDropdown && setIsMobileViewDropdown(false)}
        style={
          dashboardTrue
            ? {
                position: "fixed",
                padding: "0",
                margin: "0",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              }
            : {
                position: "absolute",
                padding: "0",
                margin: "0",
                top: "0",
                left: "0",
                width: "100%",
                height: "1000%",
              }
        }
        className="cursor-default z-[9998] bg-gray-500 opacity-70  top-4 "
      ></button>
    </>
  );
};

export default BackgroundGray;