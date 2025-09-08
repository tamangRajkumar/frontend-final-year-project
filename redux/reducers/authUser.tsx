import { LOGIN, LOGOUT, USERPROFILEIMAGEDATA } from "../actions/types";
import axios from "axios";


const initialState = {
  // isAuthenticated: false,

  isAuthenticated: (typeof window !== 'undefined') && localStorage.getItem("user") ? true : false,
  //After registered backend will send ok:true token and user data that will be stored herer
  token:(typeof window !== 'undefined') && localStorage.getItem("token")
  ? localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1') || ''
  : '',
  currentUser: (typeof window !== 'undefined') && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : {},
      
};

export const authUser = (state = initialState, action:any) => {
    switch (action.type) {
      case LOGIN:
        return {
          ...state,
          isAuthenticated: true,
          token: action.payload.token,
          currentUser: action.payload.user,
        };
      case LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          token:'',
          currentUser: action.payload.user,
        };
      default:
        return state;
    }
  };


  // user profile image update
  export const userProfileImageUpdate = (state = initialState, action:any) => {
    switch (action.type) {
      case USERPROFILEIMAGEDATA:
        return {
          ...state,
         currentUser: action.payload.user,
        };
      default:
        return state;
    }
  }