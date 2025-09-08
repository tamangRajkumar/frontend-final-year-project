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
import Logo from "../../src/components/headerFooter/Logo";
import FileUpload from "../../src/components/common/FileUpload";

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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const selectedRole = watch("role");
console.log({errors})
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

          {/* <div className="mb-4">
            <SocialButtons onSocial={handleSocial} />
          </div> */}

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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-4">Account Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Account Card */}
                <div 
                  className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRole === 'user' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : errors.role 
                        ? 'border-red-300' 
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setValue('role', 'user')}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="user"
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                        selectedRole === 'user' ? 'bg-blue-500' : 'bg-blue-100'
                      }`}>
                        <svg className={`w-6 h-6 transition-colors duration-200 ${
                          selectedRole === 'user' ? 'text-white' : 'text-blue-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                        selectedRole === 'user' ? 'text-blue-900' : 'text-gray-900'
                      }`}>Personal Account</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Are you a user trying to find cofounders? Join as an individual looking for business partners, investors, or collaborators.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          selectedRole === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>Find Cofounders</span>
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          selectedRole === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>Network</span>
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          selectedRole === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>Collaborate</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedRole === 'user'
                          ? 'border-blue-500 bg-blue-500'
                          : errors.role 
                            ? 'border-red-300' 
                            : 'border-gray-300'
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          selectedRole === 'user' 
                            ? 'bg-white opacity-100' 
                            : 'bg-blue-600 opacity-0'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Account Card */}
                <div 
                  className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRole === 'business' 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : errors.role 
                        ? 'border-red-300' 
                        : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setValue('role', 'business')}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="business"
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                        selectedRole === 'business' ? 'bg-green-500' : 'bg-green-100'
                      }`}>
                        <svg className={`w-6 h-6 transition-colors duration-200 ${
                          selectedRole === 'business' ? 'text-white' : 'text-green-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                        selectedRole === 'business' ? 'text-green-900' : 'text-gray-900'
                      }`}>Business Account</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Are you a business looking for cofounders? Post proposals, find partners, and grow your business with the right team.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          selectedRole === 'business' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-green-100 text-green-800'
                        }`}>Post Proposals</span>
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          selectedRole === 'business' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-green-100 text-green-800'
                        }`}>Find Partners</span>
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          selectedRole === 'business' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-green-100 text-green-800'
                        }`}>Grow Business</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedRole === 'business'
                          ? 'border-green-500 bg-green-500'
                          : errors.role 
                            ? 'border-red-300' 
                            : 'border-gray-300'
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          selectedRole === 'business' 
                            ? 'bg-white opacity-100' 
                            : 'bg-green-600 opacity-0'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>}
            </div>

            <div className="md:col-span-2">
              {/* KYC Document Type */}
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type *
                </label>
                <select
                  {...register("kycDocumentType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select document type</option>
                  <option value="citizenship">Citizenship Card</option>
                  <option value="pan_card">PAN Card</option>
                </select>
                {errors.kycDocumentType && (
                  <p className="text-red-500 text-sm mt-1">{errors.kycDocumentType.message}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {/* KYC Document Number */}
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Number *
                </label>
                <input
                  {...register("kycDocumentNumber")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your document number"
                />
                {errors.kycDocumentNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.kycDocumentNumber.message}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {/* KYC upload using modern FileUpload component */}
              <div className="mt-1">
                <FileUpload accept=".jpg,.jpeg,.png" multiple={false} onFilesChange={(files) => setValue('kycDocumentImage', files as any)} label="KYC Document Image *" />
                {errors.kycDocumentImage && (
                  <p className="text-red-500 text-sm mt-1">{errors.kycDocumentImage.message as any}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload JPG or PNG file</p>
              </div>
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
