import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  HiX,
  HiPlus,
  HiMinus,
  HiPhotograph,
  HiTag,
  HiBriefcase,
  HiCurrencyDollar,
  HiLocationMarker,
  HiClock,
  HiMail,
  HiPhone,
  HiGlobe,
} from "react-icons/hi";
import {
  normalPostSchema,
  businessProposalSchema,
  NormalPostFormData,
  BusinessProposalFormData,
} from "../../validation/schemas";
import { createPost, uploadImage } from "../../../pages/api";
// import { createPost, uploadImage } from "../../pages/api/index";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [postType, setPostType] = useState<"normal" | "business_proposal">(
    "normal"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const normalForm = useForm<NormalPostFormData>({
    resolver: zodResolver(normalPostSchema),
  });

  const proposalForm = useForm<BusinessProposalFormData>({
    resolver: zodResolver(businessProposalSchema),
    defaultValues: {
      businessProposal: {
        requirements: [""],
        benefits: [""],
      }
    }
  });

  const {
    getValues,
    setValue: setProposalValue,
    formState: { errors },
  } = proposalForm;
  console.log({ errors });
  console.log("Form",getValues())

  // Sync local state with form values
  useEffect(() => {
    setProposalValue("businessProposal.requirements", requirements);
  }, [requirements, setProposalValue]);

  useEffect(() => {
    setProposalValue("businessProposal.benefits", benefits);
  }, [benefits, setProposalValue]);
  const addRequirement = () => {
    const newRequirements = [...requirements, ""];
    setRequirements(newRequirements);
    proposalForm.setValue("businessProposal.requirements", newRequirements);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(newRequirements);
      proposalForm.setValue("businessProposal.requirements", newRequirements);
    }
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
    proposalForm.setValue("businessProposal.requirements", updated);
  };

  const addBenefit = () => {
    const newBenefits = [...benefits, ""];
    setBenefits(newBenefits);
    proposalForm.setValue("businessProposal.benefits", newBenefits);
  };

  const removeBenefit = (index: number) => {
    if (benefits.length > 1) {
      const newBenefits = benefits.filter((_, i) => i !== index);
      setBenefits(newBenefits);
      proposalForm.setValue("businessProposal.benefits", newBenefits);
    }
  };

  const updateBenefit = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
    proposalForm.setValue("businessProposal.benefits", updated);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadImage(formData, "");
      return response.data;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const onSubmitNormal = async (data: NormalPostFormData) => {
    try {
      setIsSubmitting(true);

      let imageData = null;
      if (data.image && data.image.length > 0) {
        imageData = await handleImageUpload(data.image[0]);
      }

      const postData = {
        title: data.title,
        description: data.description,
        category: data.category,
        postType: "normal",
        tags: tags.filter((tag) => tag.trim() !== ""),
        image: imageData,
      };

      const response = await createPost(postData, token);

      if (response.data.success) {
        toast.success("Post created successfully!");
        normalForm.reset();
        setTags([""]);
        onPostCreated();
        onClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitProposal = async (data: BusinessProposalFormData) => {
    try {
      setIsSubmitting(true);

      let imageData = null;
      if (data.image && data.image.length > 0) {
        imageData = await handleImageUpload(data.image[0]);
      }

      const postData = {
        title: data.title,
        description: data.description,
        category: data.category,
        postType: "business_proposal",
        tags: tags.filter((tag) => tag.trim() !== ""),
        image: imageData,
        businessProposal: {
          ...data.businessProposal,
          requirements: requirements.filter((req) => req.trim() !== ""),
          benefits: benefits.filter((benefit) => benefit.trim() !== ""),
        },
      };

      const response = await createPost(postData, token);

      if (response.data.success) {
        toast.success("Business proposal created successfully!");
        proposalForm.reset();
        setTags([""]);
        setRequirements([""]);
        setBenefits([""]);
        onPostCreated();
        onClose();
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast.error("Failed to create business proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Create {postType === "normal" ? "Post" : "Business Proposal"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          {/* Post Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPostType("normal")}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  postType === "normal"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Normal Post
              </button>
              {currentUser?.role === "business" && (
                <button
                  type="button"
                  onClick={() => setPostType("business_proposal")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    postType === "business_proposal"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Business Proposal
                </button>
              )}
            </div>
          </div>

          {/* Normal Post Form */}
          {postType === "normal" && (
            <form
              onSubmit={normalForm.handleSubmit(onSubmitNormal)}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  {...normalForm.register("title")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title"
                />
                {normalForm.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {normalForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...normalForm.register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your post..."
                />
                {normalForm.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {normalForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...normalForm.register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="sports">Sports</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
                {normalForm.formState.errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {normalForm.formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tag"
                    />
                    {tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <HiMinus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <HiPlus className="h-4 w-4 mr-1" />
                  Add Tag
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Optional)
                </label>
                <input
                  {...normalForm.register("image")}
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          )}

          {/* Business Proposal Form */}
          {postType === "business_proposal" && (
            <form
              onSubmit={proposalForm.handleSubmit(onSubmitProposal)}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposal Title *
                </label>
                <input
                  {...proposalForm.register("title")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter proposal title"
                />
                {proposalForm.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {proposalForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...proposalForm.register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your business proposal..."
                />
                {proposalForm.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {proposalForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...proposalForm.register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="business_proposal">Business Proposal</option>
                  <option value="partnership">Partnership</option>
                  <option value="investment">Investment</option>
                  <option value="collaboration">Collaboration</option>
                </select>
                {proposalForm.formState.errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {proposalForm.formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* Business Proposal Details */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <HiBriefcase className="h-4 w-4 mr-2" />
                  Business Proposal Details
                </h4>

                {/* Industry */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry *
                  </label>
                  <input
                    {...proposalForm.register("businessProposal.industry")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                  {proposalForm.formState.errors.businessProposal?.industry && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        proposalForm.formState.errors.businessProposal.industry
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Investment Amount */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Investment *
                    </label>
                    <input
                      {...proposalForm.register(
                        "businessProposal.investmentAmount.min",
                        { valueAsNumber: true }
                      )}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Investment *
                    </label>
                    <input
                      {...proposalForm.register(
                        "businessProposal.investmentAmount.max",
                        { valueAsNumber: true }
                      )}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Partnership Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partnership Type *
                  </label>
                  <select
                    {...proposalForm.register(
                      "businessProposal.partnershipType"
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select partnership type</option>
                    <option value="equity">Equity Partnership</option>
                    <option value="joint_venture">Joint Venture</option>
                    <option value="franchise">Franchise</option>
                    <option value="distribution">Distribution</option>
                    <option value="other">Other</option>
                  </select>
                  {proposalForm.formState.errors.businessProposal
                    ?.partnershipType && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        proposalForm.formState.errors.businessProposal
                          .partnershipType.message
                      }
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    {...proposalForm.register("businessProposal.location")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., New York, USA"
                  />
                  {proposalForm.formState.errors.businessProposal?.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        proposalForm.formState.errors.businessProposal.location
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    {...proposalForm.register("businessProposal.duration")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 6 months, 1 year, Long-term"
                  />
                  {proposalForm.formState.errors.businessProposal?.duration && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        proposalForm.formState.errors.businessProposal.duration
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements *
                  </label>
                  {requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={req}
                        onChange={(e) =>
                          updateRequirement(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter requirement"
                      />
                      {requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <HiMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <HiPlus className="h-4 w-4 mr-1" />
                    Add Requirement
                  </button>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits *
                  </label>
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter benefit"
                      />
                      {benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <HiMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <HiPlus className="h-4 w-4 mr-1" />
                    Add Benefit
                  </button>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Contact Information
                  </h5>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...proposalForm.register(
                        "businessProposal.contactInfo.email"
                      )}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contact@example.com"
                    />
                    {proposalForm.formState.errors.businessProposal?.contactInfo
                      ?.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          proposalForm.formState.errors.businessProposal
                            .contactInfo.email.message
                        }
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        {...proposalForm.register(
                          "businessProposal.contactInfo.phone"
                        )}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        {...proposalForm.register(
                          "businessProposal.contactInfo.website"
                        )}
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tag"
                    />
                    {tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <HiMinus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <HiPlus className="h-4 w-4 mr-1" />
                  Add Tag
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Optional)
                </label>
                <input
                  {...proposalForm.register("image")}
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Proposal"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
