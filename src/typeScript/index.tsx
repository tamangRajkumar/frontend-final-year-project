//  type Data = {
//     name: string;
//     age: number;
//     email: string;
// }

// User Sign Up
 export type signupData = {
  fname: string;
  lname: string;
  email: string;
  gender: string;
  country:string;
  userProfileImage:any;
  userCoverImage:any;
  password: any;
  
};


// Post Sumbit Data
export interface IPostSubmitData {
  description: string;
  category: {
    post: string;
  };
  image: {
    url: string;
    public_id: string;
  };
}


export interface IProfileImageUpdateData{
  userProfileImage:{
  url:string;
  public_id:string;
 }
}