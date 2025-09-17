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

// KYC API functions
export const submitKYC = async (formData: FormData, token: string) => {
  return await axios.post("/kyc/submit", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getKYCStatus = async (data: any, token: string) => {
  return await axios.get("/kyc/status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPendingKYC = async (data: any, token: string) => {
  return await axios.get("/kyc/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyKYC = async (userId: string, isVerified: boolean, rejectionReason: string, token: string) => {
  return await axios.post("/kyc/verify", {
    userId,
    isVerified,
    rejectionReason,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Goals and Skills API functions
export const getGoalsAndSkills = async (token: string) => {
  return await axios.get("/user/goals-skills", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateGoalsAndSkills = async (goals: string[], skills: string[], token: string) => {
  return await axios.put("/user/goals-skills", {
    goals,
    skills,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Search API functions
export const searchUsers = async (query: string, token: string) => {
  return await axios.get(`/users?search=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchPosts = async (query: string, token: string) => {
  return await axios.get(`/posts?search=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchBusinesses = async (query: string, token: string) => {
  return await axios.get(`/businesses?search=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchEvents = async (query: string, token: string) => {
  return await axios.get(`/event/search?search=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
  return axios.get(`/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get individual post
export const fetchIndividualPost = (postId: any) => {
  console.log(postId);
  return axios.get(`/posts/${postId}`);
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
    `/posts/${postId}/comment`,
    { text: addComment },

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
  return axios.get(
    `/posts/${postId}`,
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

// Get users list with pagination
export const getUsersList = (params: any, token: string) => {
  // Clean token by removing surrounding quotes if present
  const cleanToken = token?.replace(/^"(.*)"$/, '$1') || token;
  
  return axios.get(`/users`, {
    params,
    headers: {
      Authorization: `Bearer ${cleanToken}`,
    },
  });
};

// Get businesses list with pagination
export const getBusinessesList = (params: any, token: string) => {
  // Clean token by removing surrounding quotes if present
  const cleanToken = token?.replace(/^"(.*)"$/, '$1') || token;
  
  return axios.get(`/businesses`, {
    params,
    headers: {
      Authorization: `Bearer ${cleanToken}`,
    },
  });
};

// Get user by ID
export const getUserById = (id: string, token: string) => {
  return axios.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update user role
export const updateUserRole = (id: string, role: string, token: string) => {
  // Clean token by removing surrounding quotes if present
  const cleanToken = token?.replace(/^"(.*)"$/, '$1') || token;
  
  return axios.put(`/users/${id}/role`, { role }, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
    },
  });
};

// Verify business
export const verifyBusiness = (id: string, isVerified: boolean, token: string) => {
  return axios.put(`/businesses/${id}/verify`, { isVerified }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



// Unverify KYC
export const unverifyKYC = (id: string, token: string) => {
  return axios.put(`/kyc/${id}/unverify`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete user
export const deleteUser = (id: string, token: string) => {
  return axios.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Post API functions
export const createPost = (postData: any, token: string) => {
  return axios.post(`/posts`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllPosts = (params: any, token?: string) => {
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  
  return axios.get(`/posts`, {
    params,
    ...config,
  });
};

export const getPostsByUser = (userId: string, params: any, token?: string) => {
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  
  return axios.get(`/posts/user/${userId}`, {
    params,
    ...config,
  });
};

export const getPostById = (id: string, token?: string) => {
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  
  return axios.get(`/posts/${id}`, config);
};

export const updatePost = (id: string, postData: any, token: string) => {
  return axios.put(`/posts/${id}`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePost = (id: string, token: string) => {
  return axios.delete(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleLike = (id: string, token: string) => {
  return axios.post(`/posts/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addComment = (id: string, commentData: any, token: string) => {
  return axios.post(`/posts/${id}/comment`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const expressInterest = (id: string, interestData: any, token: string) => {
  return axios.post(`/posts/${id}/interest`, interestData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateInterestStatus = (id: string, interestId: string, status: string, token: string) => {
  return axios.put(`/posts/${id}/interest/${interestId}`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Register for business proposal
export const registerForProposal = (id: string, registrationData: any, token: string) => {
  return axios.post(`/posts/${id}/register`, registrationData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get registered users for a proposal
export const getRegisteredUsers = (id: string, token: string) => {
  return axios.get(`/posts/${id}/registered-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update registration status
export const updateRegistrationStatus = (id: string, registrationId: string, status: string, token: string) => {
  return axios.put(`/posts/${id}/registration/${registrationId}`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Event API functions
export const createEvent = (eventData: any, token: string) => {
  return axios.post(`/event`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllEvents = (params: any, token?: string) => {
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  return axios.get(`/event`, { params, ...config });
};

export const getAllEventsAdmin = (params: any, token: string) => {
  return axios.get(`/event/admin/all`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEventsByOrganizer = (organizerId: string, params: any, token: string) => {
  return axios.get(`/event/organizer/${organizerId}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEventById = (id: string, token?: string) => {
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  return axios.get(`/event/${id}`, config);
};

export const updateEvent = (id: string, eventData: any, token: string) => {
  return axios.put(`/event/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteEvent = (id: string, token: string) => {
  return axios.delete(`/event/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerForEvent = (id: string, registrationData: any, token: string) => {
  return axios.post(`/event/${id}/register`, registrationData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEventRegistrations = (id: string, token: string) => {
  return axios.get(`/event/${id}/registrations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleEventLike = (id: string, token: string) => {
  return axios.post(`/event/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addEventComment = (id: string, commentData: any, token: string) => {
  return axios.post(`/event/${id}/comment`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Chat API functions
export const createOrGetChat = (participantId: string, token: string) => {
  // Clean token by removing surrounding quotes if present
  const cleanToken = token?.replace(/^"(.*)"$/, '$1') || token;
  
  return axios.post(`/chat/create`, { participantId }, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
    },
  });
};

export const getUserChats = (params: any, token: string) => {
  return axios.get(`/chat`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getChatMessages = (chatId: string, params: any, token: string) => {
  return axios.get(`/chat/${chatId}/messages`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMessage = (chatId: string, messageData: any, token: string) => {
  return axios.post(`/chat/${chatId}/messages`, messageData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markMessagesAsRead = (chatId: string, token: string) => {
  return axios.put(`/chat/${chatId}/read`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteMessage = (messageId: string, token: string) => {
  return axios.delete(`/chat/messages/${messageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editMessage = (messageId: string, content: string, token: string) => {
  return axios.put(`/chat/messages/${messageId}`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUnreadCount = (token: string) => {
  return axios.get(`/chat/unread/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteChat = (chatId: string, token: string) => {
  return axios.delete(`/chat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const archiveChat = (chatId: string, token: string) => {
  return axios.put(`/chat/${chatId}/archive`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const unarchiveChat = (chatId: string, token: string) => {
  return axios.put(`/chat/${chatId}/unarchive`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Featured content API functions
export const getFeaturedContent = () => {
  return axios.get(`/featured/`);
};

export const getAllFeaturedContent = (token: string) => {
  return axios.get(`/featured/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleFeaturedProposal = (postId: string, isFeatured: boolean, token: string) => {
  return axios.put(`/posts/${postId}/featured`, { isFeatured }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleFeaturedBusiness = (userId: string, token: string) => {
  return axios.put(`/featured/business/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleFeaturedEvent = (eventId: string, isFeatured: boolean, token: string) => {
  return axios.put(`/event/${eventId}/featured`, { isFeatured }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFeaturedEvents = async (token: string) => {
  return axios.get(`/event?featured=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFeaturedPosts = async (token: string) => {
  return axios.get(`/posts?featured=true&postType=business_proposal`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};