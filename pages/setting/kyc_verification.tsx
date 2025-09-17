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
// import FileUpload from "../../src/components/common/FileUpload";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";
import { submitKYC, getKYCStatus } from "../api";

const KYCVerification: NextPage = () => {
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

  const getStatusIcon = () => {
    if (!kycStatus || !kycStatus.documentType) {
      return <HiExclamation className="h-8 w-8 text-yellow-500" />;
    }
    
    if (kycStatus.isVerified) {
      return <HiCheckCircle className="h-8 w-8 text-green-500" />;
    }
    
    return <HiClock className="h-8 w-8 text-blue-500" />;
  };

  const getStatusText = () => {
    if (!kycStatus || !kycStatus.documentType) {
      return "Not Submitted";
    }
    
    if (kycStatus.isVerified) {
      return "Verified";
    }
    
    return "Pending Review";
  };

  const getStatusColor = () => {
    if (!kycStatus || !kycStatus.documentType) {
      return "text-yellow-600 bg-yellow-100";
    }
    
    if (kycStatus.isVerified) {
      return "text-green-600 bg-green-100";
    }
    
    return "text-blue-600 bg-blue-100";
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
      {/* Sidebar Setting Options */}
      <SidebarSettingOptions />

      {/* Main Content */}
      <div className="ml-16 space-y-8 flex flex-col flex-grow mt-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <HiDocumentText className="h-8 w-8 mr-3 text-orange-500" />
              KYC Verification
            </h1>
            <p className="text-gray-600 mt-1">
              Verify your identity to access all platform features
            </p>
          </div>
          <button
            onClick={fetchKYCStatus}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <HiRefresh className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Current Status */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div>
              {kycStatus && kycStatus.documentType ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Document Type:</span> {
                      kycStatus.documentType === 'pan_card' ? 'PAN Card' : 
                      kycStatus.documentType === 'citizenship' ? 'Citizenship Card' :
                      kycStatus.documentType === 'passport' ? 'Passport' :
                      kycStatus.documentType
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Document Number:</span> {kycStatus.documentNumber}
                  </p>
                  {kycStatus.verifiedAt && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Verified On:</span> {
                        new Date(kycStatus.verifiedAt).toLocaleDateString()
                      }
                    </p>
                  )}
                  {kycStatus.rejectionReason && (
                    <p className="text-sm text-red-600">
                      <span className="font-medium">Rejection Reason:</span> {kycStatus.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No KYC documents submitted yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* KYC Form */}
        {(!kycStatus || !kycStatus.documentType || kycStatus.rejectionReason) && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {kycStatus?.rejectionReason ? 'Resubmit KYC Documents' : 'Submit KYC Documents'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Document Type */}
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
                  {currentUser?.role === 'user' ? (
                    <>
                      <option value="citizenship">Citizenship Card</option>
                      <option value="passport">Passport</option>
                    </>
                  ) : (
                    <option value="pan_card">PAN Card</option>
                  )}
                </select>
                {errors.documentType && (
                  <p className="text-red-500 text-sm mt-1">{errors.documentType.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {currentUser?.role === 'user' 
                    ? 'Select your citizenship card or passport' 
                    : 'Select your PAN card for business verification'
                  }
                </p>
              </div>

              {/* Document Number */}
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

              {/* Document Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Image *
                </label>
                <input
                  {...register("documentImage")}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.documentImage ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.documentImage && (
                  <p className="text-red-500 text-sm mt-1">{errors.documentImage.message as any}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a clear image of your document (JPG, PNG, max 5MB)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit KYC Documents'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Why KYC Verification?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Ensures platform security and trust</li>
            <li>• Required for posting business proposals</li>
            <li>• Enables access to premium features</li>
            <li>• Helps build credibility with other users</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">
              Document Requirements:
            </p>
            <ul className="text-xs text-blue-800 mt-1">
              {currentUser?.role === 'user' ? (
                <>
                  <li>• <strong>Users:</strong> Citizenship Card or Passport</li>
                  <li>• <strong>Businesses:</strong> PAN Card</li>
                </>
              ) : (
                <>
                  <li>• <strong>Businesses:</strong> PAN Card</li>
                  <li>• <strong>Users:</strong> Citizenship Card or Passport</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
