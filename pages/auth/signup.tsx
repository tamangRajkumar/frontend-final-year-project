import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { signUp, uploadImage } from "../api";
import { useRouter } from "next/router";
import Image from "next/image";
import { Image1 } from "../../src/assets";
import { useSelector } from "react-redux";
import Link from "next/link";
import { countriesData } from "../api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "../../src/validation/schemas";

const Signup: NextPage = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const router = useRouter();

  //check whether the user is logged in or not if logged in and isAuthenticated is true then redirect to dashboard
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  
  if (authUser == true && currentUser) {
    // Route based on user role
    const userRole = currentUser.role;
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
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Handle file upload for KYC document
      let kycDocumentImage = { url: "", public_id: "" };
      
      if (data.kycDocumentImage && data.kycDocumentImage.length > 0) {
        const file = data.kycDocumentImage[0];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const uploadResponse = await uploadImage(formData, '');
          kycDocumentImage = uploadResponse.data;
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          toast.error("Failed to upload KYC document. Please try again.");
          return;
        }
      }

      const signUpData = {
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        password: data.password,
        country: data.country,
        gender: data.gender,
        role: data.role,
        kycInfo: {
          documentType: data.kycDocumentType,
          documentNumber: data.kycDocumentNumber,
          documentImage: kycDocumentImage,
        },
        userProfileImage: {
          url: "",
          public_key: "",
        },
        userCoverImage: {
          url: "",
          public_key: "",
        },
        favoritePostsList: [],
      };
      
      const { data: response } = await signUp(signUpData);
      console.log(response);
      if (response.ok) {
        router.push("/auth/login");
        toast.success("Successfully signed up! Your account is pending KYC verification. Please wait for admin approval.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sign Up failed, Please try again!");
    }
  };

  // Fetch countries name api
  useEffect(() => {
    fetchCountriesData();
  }, []);

  const fetchCountriesData = async () => {
    try {
      const { data } = await countriesData();
      console.log(
        data?.data.map((c: any) => {
          return c.country;
        })
      );
      setCountries(data?.data);
    } catch (error) {
      console.log("Error=>", error);
    }
  };

  return (
    <>
      <div className=" flex justify-around mt-16 mb-20 ">
        {/* Posted Image  */}
        <div className="flex  w-[90vh]     ">
          <Image
            src={Image1}
            alt="Picture of the user"
            // layout="fill"
            // objectFit="contain"
            className="cursor-pointer"
          />
        </div>

        <div className=" flex-cols mt-5 justify-center items-center">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Sign Up</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full name fields */}
            <div className="flex justify-center items-center space-x-6">
              {/* First Name Field */}
              <div className="my-5 flex flex-col justify-center">
                <input
                  type="text"
                  {...register("fname")}
                  placeholder="First Name"
                  className={`py-1.5 px-2 shadow-md rounded-2xl outline-none text-center ${
                    errors.fname ? "border-2 border-red-500" : ""
                  }`}
                />
                {errors.fname && (
                  <p className="text-red-500 text-sm mt-1 text-center">
                    {errors.fname.message}
                  </p>
                )}
              </div>

              {/* Last Name Field */}
              <div className="my-5 flex flex-col justify-center">
                <input
                  type="text"
                  {...register("lname")}
                  placeholder="Last Name"
                  className={`py-1.5 px-6 shadow-md rounded-2xl outline-none text-center ${
                    errors.lname ? "border-2 border-red-500" : ""
                  }`}
                />
                {errors.lname && (
                  <p className="text-red-500 text-sm mt-1 text-center">
                    {errors.lname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Choose country Field */}
            <div className=" mt-2 flex flex-col justify-center items-center ">
              <select
                {...register("country")}
                className={`text-gray-400 px-3 w-[30vh] py-1 focus:outline-none shadow-md border-gray-300 rounded-xl cursor-pointer ${
                  errors.country ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="">Select your country</option>
                {countries?.map((data: any, i: number) => {
                  return (
                    <option key={i} value={data.country}>
                      {data.country}
                    </option>
                  );
                })}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Select gender options */}
            <div className=" mt-5 flex flex-col justify-center items-center ">
              <select
                {...register("gender")}
                className={`text-gray-400 px-3 w-[20vh] py-1 focus:outline-none shadow-md border-gray-300 rounded-xl cursor-pointer ${
                  errors.gender ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Select account type */}
            <div className=" mt-5 flex flex-col justify-center items-center ">
              <select
                {...register("role")}
                className={`text-gray-400 px-3 w-[25vh] py-1 focus:outline-none shadow-md border-gray-300 rounded-xl cursor-pointer ${
                  errors.role ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="">Account Type</option>
                <option value="user">Personal Account</option>
                <option value="business">Business Account</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="my-5 flex flex-col justify-center items-center ">
              <input
                type="email"
                {...register("email")}
                placeholder="Email"
                className={`py-1.5 px-10 shadow-md rounded-2xl outline-none text-center ${
                  errors.email ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-5 flex flex-col justify-center items-center ">
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className={`py-1.5 px-5 shadow-md rounded-2xl outline-none text-center ${
                  errors.password ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* KYC Document Type */}
            <div className="mb-5 flex flex-col justify-center items-center ">
              <select
                {...register("kycDocumentType")}
                className={`text-gray-400 px-3 w-[25vh] py-1 focus:outline-none shadow-md border-gray-300 rounded-xl cursor-pointer ${
                  errors.kycDocumentType ? "border-2 border-red-500" : ""
                }`}
              >
                <option value="">Document Type</option>
                <option value="citizenship">Citizenship</option>
                <option value="pan_card">PAN Card</option>
              </select>
              {errors.kycDocumentType && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.kycDocumentType.message}
                </p>
              )}
            </div>

            {/* KYC Document Number */}
            <div className="mb-5 flex flex-col justify-center items-center ">
              <input
                type="text"
                {...register("kycDocumentNumber")}
                placeholder="Document Number"
                className={`py-1.5 px-5 shadow-md rounded-2xl outline-none text-center ${
                  errors.kycDocumentNumber ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.kycDocumentNumber && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.kycDocumentNumber.message}
                </p>
              )}
            </div>

            {/* KYC Document Upload */}
            <div className="mb-5 flex flex-col justify-center items-center ">
              <input
                type="file"
                {...register("kycDocumentImage")}
                accept=".jpg,.jpeg,.png"
                className={`py-1.5 px-5 shadow-md rounded-2xl outline-none text-center text-sm ${
                  errors.kycDocumentImage ? "border-2 border-red-500" : ""
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">Upload JPG or PNG file</p>
              {errors.kycDocumentImage && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.kycDocumentImage.message}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="text-md font-bold bg-black text-white px-5 pt-1 pb-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            {/* Login Redirect */}
            <div className="flex space-x-2 mt-5 justify-center items-center">
              <p>Already Signed up?</p>
              <Link href="/auth/login">
                <a className="text-red-400 underline underline-offset-4 cursor-pointer">
                  Log in
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
