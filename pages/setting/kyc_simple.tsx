import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kycSchema, KYCFormData } from "../../src/validation/schemas";
import { toast } from "react-toastify";
import { 
  HiDocumentText, 
  HiCheckCircle, 
  HiXCircle, 
  HiClock,
  HiExclamation,
  HiRefresh
} from "react-icons/hi";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";
import { submitKYC, getKYCStatus } from "../api";

const KYCSimple: NextPage = () => {
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KYCFormData>({ resolver: zodResolver(kycSchema) });

  useEffect(() => {
    if (token) {
      fetchKYCStatus();
    }
  }, [token]);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const { data } = await getKYCStatus({}, token);
      if (data.success) {
        setKycStatus(data.kycInfo);
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      toast.error("Failed to fetch KYC status");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: KYCFormData) => {
    try {
      setSubmitting(true);
      
      // Handle file upload
      const formData = new FormData();
      formData.append('documentType', data.documentType);
      formData.append('documentNumber', data.documentNumber);
      formData.append('documentImage', (data.documentImage as any)[0]);

      const { data: response } = await submitKYC(formData, token);
      
      if (response.success) {
        toast.success(response.message);
        fetchKYCStatus(); // Refresh status
      }
    } catch (error: any) {
      console.error("Error submitting KYC:", error);
      toast.error(error.response?.data?.message || "Failed to submit KYC documents");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex px-20 h-[100vh] bg-white">
        <SidebarSettingOptions />
        <div className="ml-16 flex flex-col flex-grow mt-20 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading KYC status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex px-20 h-[100vh] bg-white">
      <SidebarSettingOptions />
      <div className="ml-16 space-y-8 flex flex-col flex-grow mt-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <HiDocumentText className="h-8 w-8 mr-3 text-orange-500" />
              KYC Verification (Simple)
            </h1>
            <p className="text-gray-600 mt-1">
              Verify your identity to access all platform features
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
          <p>Status: {kycStatus ? 'Loaded' : 'Not loaded'}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit KYC Documents</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                {...register("documentType")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.documentType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select document type</option>
                <option value="citizenship">Citizenship Card</option>
                <option value="pan_card">PAN Card</option>
              </select>
              {errors.documentType && (
                <p className="text-red-500 text-sm mt-1">{errors.documentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Number *
              </label>
              <input
                {...register("documentNumber")}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.documentNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your document number"
              />
              {errors.documentNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.documentNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Image *
              </label>
              <input
                {...register("documentImage")}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.documentImage && (
                <p className="text-red-500 text-sm mt-1">{errors.documentImage.message as any}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? 'Submitting...' : 'Submit KYC Documents'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCSimple;

