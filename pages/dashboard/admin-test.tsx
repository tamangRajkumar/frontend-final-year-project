import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const AdminTest: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!authUser || currentUser?.role !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Test</h1>
          <p className="text-gray-600">This is a simplified version to test the admin dashboard.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
          <p>Email: {currentUser?.email}</p>
          <p>Role: {currentUser?.role}</p>
          <p>Name: {currentUser?.fname} {currentUser?.lname}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/user")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to User Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
