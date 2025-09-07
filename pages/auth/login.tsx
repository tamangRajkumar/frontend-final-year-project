import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInUser } from "../../redux/actions/authActions";
import Image from "next/image";
import { Image1 } from "../../src/assets";
import Link from "next/link";
import { loginSchema, LoginFormData } from "../../src/validation/schemas";

const Login: NextPage = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();

  // Check whether the user is logged in or not if logged in and isAuthenticated is true then redirect to dashboard
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(logInUser(data, router));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-around mt-24 mb-20">
        {/* Posted Image */}
        <div className="flex w-[90vh]">
          <Image
            src={Image1}
            alt="Picture of the user"
            className="cursor-pointer"
          />
        </div>

        <div className="flex-cols mt-14 justify-center items-center">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Log in</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-5">
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
            <div className="mb-5 flex justify-center items-center">
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
            <div className="flex justify-center items-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="text-md font-bold bg-black text-white px-5 pt-1 pb-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </div>

            {/* Sign Up Redirect */}
            <div className="flex space-x-2 mt-5 justify-center items-center">
              <p>Not yet Signed up?</p>
              <Link href="/auth/signup">
                <a className="text-red-400 underline underline-offset-4 cursor-pointer">
                  sign up
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
