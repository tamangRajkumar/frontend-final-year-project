import { LOGIN, USERPROFILEDATA, LOGOUT, USERPROFILEIMAGEDATA } from "./types";
import * as api from "../../pages/api";
import { toast } from "react-toastify";

// log in user
export const logInUser =
  (userLogInData: any, router: any) => async (dispatch: any) => {
    try {
      const { data } = await api.loginUser(userLogInData);
      if (data) {
        dispatch({
          type: LOGIN,
          payload: data,
        });
        if (data) {
          dispatch({
            type: USERPROFILEDATA,
            payload: data.user.image,
          });
        }

        if (data.ok == "true") {
          // Save user data  in local storage
          window.localStorage.setItem("user", JSON.stringify(data.user));
          // Save user authentication token in local storage
          window.localStorage.setItem("token", data.token);

          // Save user profile data in local storage
          // window.localStorage.setItem(
          //   "userProfileData",
          //   JSON.stringify(data.user.image)
          // );

          // Create local storage for favorite Posts List
          window.localStorage.setItem("favoritePostsList", JSON.stringify([]));

          // Route based on user role
          const userRole = data.user.role;
          let dashboardRoute = "/dashboard/user";
          
          switch (userRole) {
            case "admin":
              dashboardRoute = "/dashboard/admin";
              break;
            case "business":
              dashboardRoute = "/dashboard/business";
              break;
            case "user":
            default:
              dashboardRoute = "/dashboard/user";
              break;
          }

          router.push(dashboardRoute);
          toast.success(`Welcome, You have logged in successfully as ${userRole}.`);
        }
      }
    } catch (error) {
      // console.log("ERROR=> ", error);
      toast.error(error?.response?.data);
    }
  };

// Log Out User From Browser when clicked Log Out
export const logOutUser = (userLogOut: any) => {
  return { type: LOGOUT, payload: userLogOut };
};

// User profile image update
export const userProfileImageUpdate = (user: any) => async (dispatch: any) => {
  if (user) {
    dispatch({ type: USERPROFILEIMAGEDATA, payload: user });
  }
  if (user) {
    window.localStorage.setItem("user", JSON.stringify(user));
  }
};
