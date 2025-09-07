import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { signUp, uploadImage } from "../api";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import { countriesData } from "../api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "../../src/validation/schemas";
import AnimatedAuthBg from "../../src/components/common/AnimatedAuthBg";
import SocialButtons from "../../src/components/auth/SocialButtons";

const Signup: NextPage = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const router = useRouter();

  // Redirect if already authenticated
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  if (authUser == true && currentUser) {
    const role = currentUser.role;
    const route = role === 'admin' ? '/dashboard/admin' : role === 'business' ? '/dashboard/business' : '/dashboard/user';
    router.push(route);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Handle file upload for KYC document
      let kycDocumentImage = { url: "", public_id: "" };
      if (data.kycDocumentImage && (data.kycDocumentImage as any).length > 0) {
        const file = (data.kycDocumentImage as any)[0];
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
        userProfileImage: { url: "", public_key: "" },
        userCoverImage: { url: "", public_key: "" },
        favoritePostsList: [],
      };

      const { data: response } = await signUp(signUpData);
      if (response.ok) {
        router.push("/auth/login");
        toast.success("Successfully signed up! Your account is pending KYC verification. Please wait for admin approval.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sign Up failed, Please try again!");
    }
  };

  useEffect(() => {
    fetchCountriesData();
  }, []);

  const fetchCountriesData = async () => {
    try {
      const { data } = await countriesData();
      setCountries(data?.data || []);
    } catch (error) {
      console.log("Error=>", error);
    }
  };

  const handleSocial = (type: string) => {
    alert(`Social signup: ${type}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <AnimatedAuthBg />

      <div className="w-full max-w-4xl">
        <div className="bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20">
              <Logo size={64} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-600">Join founders, post proposals, and find your match.</p>
          </div>

          <div className="mb-4">
            <SocialButtons onSocial={handleSocial} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">First name</label>
              <input type="text" {...register("fname")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.fname ? 'ring-2 ring-red-300' : ''}`} />
              {errors.fname && <p className="text-red-500 text-sm mt-1">{errors.fname.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Last name</label>
              <input type="text" {...register("lname")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.lname ? 'ring-2 ring-red-300' : ''}`} />
              {errors.lname && <p className="text-red-500 text-sm mt-1">{errors.lname.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input type="email" {...register("email")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.email ? 'ring-2 ring-red-300' : ''}`} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input type="password" {...register("password")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.password ? 'ring-2 ring-red-300' : ''}`} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Country</label>
              <select {...register("country")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none ${errors.country ? 'ring-2 ring-red-300' : ''}`}>
                <option value="">Select country</option>
                {countries?.map((c: any, i: number) => (<option key={i} value={c.country}>{c.country}</option>))}
              </select>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Gender</label>
              <select {...register("gender")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none ${errors.gender ? 'ring-2 ring-red-300' : ''}`}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Account type</label>
              <select {...register("role")} className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none ${errors.role ? 'ring-2 ring-red-300' : ''}`}>
                <option value="">Select</option>
                <option value="user">Personal Account</option>
                <option value="business">Business Account</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-700">KYC Document (optional)</label>
              <input type="file" {...register("kycDocumentImage")} accept=".jpg,.jpeg,.png" className="mt-1 w-full" />
              <p className="text-xs text-gray-500 mt-1">Upload JPG or PNG file</p>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl py-3 font-semibold text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#f26722,#ff8f57)' }}>
                {isSubmitting ? 'Signing up...' : 'Create account'}
              </button>
            </div>

            <div className="md:col-span-2 text-center text-sm text-gray-700">
              By signing up you agree to our <a className="text-orange-500">Terms</a> and <a className="text-orange-500">Privacy</a>.
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-700">
            Already have an account? <Link href="/auth/login"><a className="text-orange-500 underline">Log in</a></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
