import axios from "axios";
import {
  IPostSubmitData,
  IProfileImageUpdateData,
  signupData,
} from "../../src/typeScript";

//sign up
export const signUp = async (signupData: signupData) => {
  return await axios.post("/auth/signup", signupData);
};

type loginData = {
  email: any;
  password: any;
};

//login
export const loginUser = async (loginData: loginData) => {
  return await axios.post("/auth/login", loginData);
};

// Fetch Countries name
export const countriesData = async () => {
  return await axios.get("https://countriesnow.space/api/v0.1/countries");
};

// Upload Image Cloudinary
export const uploadImage = async (formData: any, token: string) => {
  return await axios.post("/upload-image", formData);
};

// Handle Post Submit
export const postSubmit = (postSubmitData: IPostSubmitData, token: string) => {
  return axios.post(`/create-post`, postSubmitData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// fetch User Posts show in dashboard
export const fetchPosts = (token: string) => {
  return axios.get(`/user-posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get individual post
export const fetchIndividualPost = (postId: any) => {
  console.log(postId);
  return axios.get(`/fetchindividualpost/${postId}`);
};

// fetch all Posts show in news feed
export const fetchAllPosts = (category: string) => {
  return axios.get(`/fetch-all-users-posts/${category}`);
};

// Update User Profile
export const updateUserProfile = (
  postSubmitData: IProfileImageUpdateData,
  token: string
) => {
  return axios.put(`/update-user-profile`, postSubmitData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Handle Submit comments in the post
export const postCommentSubmit = (
  addComment: string,
  postId: any,
  token: string
) => {
  return axios.post(
    `/submit-post-comment`,
    { addComment, postId },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Handle Delete Post Comment
export const deletePostComment = (
  postId: any,
  commentId: any,
  token: string
) => {
  return axios.put(
    `/delete-post-comment`,
    { postId, commentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// fetch post comments data only
export const fetchPostCommentsDataOnly = (postId: any, token: string) => {
  return axios.post(
    `/post-comments-data`,
    { postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Post Liked
export const postLiked = (postId: any, token: string) => {
  return axios.put(
    `/post-liked`,
    { postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Post unliked
export const postUnliked = (postId: any, token: string) => {
  return axios.put(
    `/post-unliked`,
    { postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Get all users
export const fetchAllUsers = () => {
  return axios.get(`/fetch-all-users`);
};
