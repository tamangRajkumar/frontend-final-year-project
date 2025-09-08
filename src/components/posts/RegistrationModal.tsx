import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { HiX, HiPlus, HiTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { registrationSchema, RegistrationFormData } from "../../validation/schemas";
import { registerForProposal } from "../../../pages/api";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  onRegistrationSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  proposalId,
  onRegistrationSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const token = useSelector((state: any) => state.authUser.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);
      
      const registrationData = {
        ...data,
        skills,
      };

      if (!token) {
        toast.error("Please login to register for proposals");
        return;
      }

      const response = await registerForProposal(proposalId, registrationData, token);
      
      if (response.data.success) {
        toast.success("Registration submitted successfully!");
        onRegistrationSuccess();
        handleClose();
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSkills([]);
    setNewSkill("");
    onClose();
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Register for Business Proposal</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Eligibility Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you eligible for this proposal? *
              </label>
              <textarea
                {...register("eligibilityReason")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Explain why you are a good fit for this business proposal..."
              />
              {errors.eligibilityReason && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.eligibilityReason.message}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relevant Experience
              </label>
              <textarea
                {...register("experience")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your relevant business or industry experience..."
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HiPlus className="h-4 w-4" />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <HiTrash className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Investment Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Capacity
              </label>
              <select
                {...register("investmentCapacity")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your investment capacity</option>
                <option value="low">Low ($1,000 - $10,000)</option>
                <option value="medium">Medium ($10,000 - $50,000)</option>
                <option value="high">High ($50,000+)</option>
              </select>
              {errors.investmentCapacity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.investmentCapacity.message}
                </p>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                {...register("additionalInfo")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any additional information you'd like to share..."
              />
              {errors.additionalInfo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.additionalInfo.message}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    {...register("contactInfo.email")}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register("contactInfo.phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Registration</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
