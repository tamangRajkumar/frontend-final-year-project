import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInUser } from "../../redux/actions/authActions";
import Link from "next/link";
import { loginSchema, LoginFormData } from "../../src/validation/schemas";
import AnimatedAuthBg from "../../src/components/common/AnimatedAuthBg";
import SocialButtons from "../../src/components/auth/SocialButtons";
import Logo from "../../src/components/headerFooter/Logo";

const Login: NextPage = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();

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
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(logInUser(data, router));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSocial = (type: string) => {
    // placeholder for social login flow
    alert(`Social login: ${type}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <AnimatedAuthBg />

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left - Intro */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* <div className="h-12 w-12">
                <Logo size={44} />
              </div> */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Welcome back</h3>
                <p className="text-gray-600">Sign in to continue collaborating and find your ideal cofounder.</p>
              </div>
            </div>

            <div className="mt-6 bg-white/80 border border-gray-200 rounded-2xl p-4 shadow">
              <h4 className="font-semibold text-gray-800">Why LinkCofounders?</h4>
              <ul className="text-sm text-gray-600 mt-3 space-y-2">
                <li>• Curated founder matches</li>
                <li>• Secure messaging and profiles</li>
                <li>• Events and workshops</li>
              </ul>
            </div>
          </div>

          {/* Right - Card */}
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <div className="text-center mb-4">
              <div className="mx-auto w-20 h-20 text-start ">
                <Logo size={64}  hideBranchName/>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Log in to LinkCofounders</h2>
              <p className="text-sm text-gray-600">Fast. Secure. Tailored for founders.</p>
            </div>

            {/* <div className="space-y-4 mb-4">
              <SocialButtons onSocial={handleSocial} />
            </div> */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input type="email" {...register("email")} placeholder="you@company.com"
                  className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition ${errors.email ? 'ring-2 ring-red-300' : ''}`} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input type="password" {...register("password")} placeholder="Your password"
                  className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition ${errors.password ? 'ring-2 ring-red-300' : ''}`} />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="h-4 w-4" />
                  <label htmlFor="remember" className="text-gray-700">Remember me</label>
                </div>
                <Link href="#"><a className="text-orange-500">Forgot?</a></Link>
              </div>

              <div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full rounded-xl py-3 font-semibold text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#f26722,#ff8f57)' }}>
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </button>
              </div>

              <div className="text-center text-sm text-gray-700">
                Don’t have an account? <Link href="/auth/signup"><a className="text-orange-500 underline">Sign up</a></Link>
              </div>
            </form>

          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 800ms ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Login;


