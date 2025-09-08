import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { HiX, HiPlus, HiTrash, HiCalendar, HiClock, HiLocationMarker, HiUsers, HiCurrencyDollar } from "react-icons/hi";
import { useSelector } from "react-redux";
import { eventSchema, EventFormData } from "../../validation/schemas";
import { createEvent, uploadImage } from "../../../pages/api";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const token = useSelector((state: any) => state.authUser.token);
  const [newTag, setNewTag] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const eventType = watch("eventType");

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      // Handle file upload for event image
      let eventImage = { url: "", public_id: "" };

      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const uploadResponse = await uploadImage(formData, '');
          eventImage = uploadResponse.data;
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          toast.error("Failed to upload event image. Please try again.");
          return;
        }
      }

      const eventData = {
        ...data,
        image: eventImage,
        tags,
        requirements,
        benefits,
        registrationFee: data.registrationFee || 0,
      };

      if (!token) {
        toast.error("Please login to create events");
        return;
      }

      const response = await createEvent(eventData, token);
      
      if (response.data.success) {
        toast.success("Event created successfully!");
        onEventCreated();
        handleClose();
      }
    } catch (error: any) {
      console.error("Event creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setTags([]);
    setRequirements([]);
    setBenefits([]);
    setNewTag("");
    setNewRequirement("");
    setNewBenefit("");
    onClose();
  };

  const addItem = (type: 'tag' | 'requirement' | 'benefit') => {
    const value = type === 'tag' ? newTag : type === 'requirement' ? newRequirement : newBenefit;
    if (value.trim()) {
      const array = type === 'tag' ? tags : type === 'requirement' ? requirements : benefits;
      const setter = type === 'tag' ? setTags : type === 'requirement' ? setRequirements : setBenefits;
      
      if (!array.includes(value.trim())) {
        setter([...array, value.trim()]);
      }
      
      if (type === 'tag') setNewTag("");
      if (type === 'requirement') setNewRequirement("");
      if (type === 'benefit') setNewBenefit("");
    }
  };

  const removeItem = (type: 'tag' | 'requirement' | 'benefit', index: number) => {
    const array = type === 'tag' ? tags : type === 'requirement' ? requirements : benefits;
    const setter = type === 'tag' ? setTags : type === 'requirement' ? setRequirements : setBenefits;
    setter(array.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'tag' | 'requirement' | 'benefit') => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(type);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Create New Event</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="sports">Sports</option>
                  <option value="networking">Networking</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Event Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  {...register("eventType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select event type</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  {...register("location")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={eventType === 'online' ? 'Online platform (e.g., Zoom, Teams)' : 'Physical address'}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  {...register("startDate")}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  {...register("endDate")}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  {...register("startTime")}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  {...register("endTime")}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Capacity and Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees *
                </label>
                <input
                  {...register("maxAttendees", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
                {errors.maxAttendees && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxAttendees.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Fee (USD)
                </label>
                <input
                  {...register("registrationFee", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.registrationFee && (
                  <p className="text-red-500 text-sm mt-1">{errors.registrationFee.message}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'tag')}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => addItem('tag')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HiPlus className="h-4 w-4" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeItem('tag', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <HiTrash className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'requirement')}
                  placeholder="Add a requirement..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => addItem('requirement')}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <HiPlus className="h-4 w-4" />
                </button>
              </div>
              {requirements.length > 0 && (
                <div className="space-y-1">
                  {requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm text-gray-700">{requirement}</span>
                      <button
                        type="button"
                        onClick={() => removeItem('requirement', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <HiTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'benefit')}
                  placeholder="Add a benefit..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => addItem('benefit')}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <HiPlus className="h-4 w-4" />
                </button>
              </div>
              {benefits.length > 0 && (
                <div className="space-y-1">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm text-gray-700">{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeItem('benefit', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <HiTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    {...register("contactInfo.email")}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    {...register("contactInfo.phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  {...register("contactInfo.website")}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
                {errors.contactInfo?.website && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactInfo.website.message}
                  </p>
                )}
              </div>
            </div>

            {/* Event Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <input
                {...register("image")}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Upload JPG or PNG file (optional)</p>
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Event</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
