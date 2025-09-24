import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { 
  HiArrowLeft,
  HiSave,
  HiX,
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiUsers,
  HiCurrencyDollar,
  HiTag,
  HiPhoto,
  HiTrash
} from "react-icons/hi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEventById, updateEvent, deleteEvent } from "../../../../api/index";

// Validation schema for event update
const eventUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  category: z.string().min(1, "Category is required"),
  eventType: z.enum(['online', 'offline', 'hybrid']),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  maxAttendees: z.number().min(1, "Maximum attendees must be at least 1"),
  registrationFee: z.number().min(0, "Registration fee cannot be negative"),
  currency: z.string().default('USD'),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  contactInfo: z.object({
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  }),
});

type EventUpdateFormData = z.infer<typeof eventUpdateSchema>;

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  eventType: 'online' | 'offline' | 'hybrid';
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  registrationFee: number;
  currency: string;
  organizer: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    role: string;
  };
  image?: {
    url: string;
    public_id: string;
  };
  tags: string[];
  requirements: string[];
  benefits: string[];
  contactInfo: {
    email: string;
    phone?: string;
    website?: string;
  };
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditEventPage: NextPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<EventUpdateFormData>({
    resolver: zodResolver(eventUpdateSchema),
  });

  useEffect(() => {
    if (id && token) {
      fetchEvent();
    }
  }, [id, token]);

  useEffect(() => {
    if (event) {
      // Set form values from event data
      reset({
        title: event.title,
        description: event.description,
        category: event.category,
        eventType: event.eventType,
        location: event.location,
        startDate: event.startDate.split('T')[0], // Extract date part
        endDate: event.endDate.split('T')[0],
        startTime: event.startTime,
        endTime: event.endTime,
        maxAttendees: event.maxAttendees,
        registrationFee: event.registrationFee,
        currency: event.currency,
        tags: event.tags || [],
        requirements: event.requirements || [],
        benefits: event.benefits || [],
        contactInfo: event.contactInfo,
      });
    }
  }, [event, reset]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await getEventById(id as string, token);
      
      if (data.success) {
        const eventData = data.data;
        
        // Check if user owns this event
        if (eventData.organizer._id !== currentUser._id) {
          toast.error("You can only edit your own events");
          router.push("/dashboard/business");
          return;
        }
        
        setEvent(eventData);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to fetch event");
      router.push("/dashboard/business");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EventUpdateFormData) => {
    try {
      setIsSubmitting(true);
      
      // Convert date strings to proper format
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      
      const eventData = {
        ...data,
        startDate: startDateTime,
        endDate: endDateTime,
      };

      const response = await updateEvent(event._id, eventData, token);
      
      if (response.data.success) {
        toast.success("Event updated successfully!");
        router.push("/dashboard/business");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteEvent(event._id, token);
      
      if (response.data.success) {
        toast.success("Event deleted successfully!");
        router.push("/dashboard/business");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch("tags") || [];
    setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = watch("requirements") || [];
      setValue("requirements", [...currentRequirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  const removeRequirement = (requirementToRemove: string) => {
    const currentRequirements = watch("requirements") || [];
    setValue("requirements", currentRequirements.filter(req => req !== requirementToRemove));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      const currentBenefits = watch("benefits") || [];
      setValue("benefits", [...currentBenefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    const currentBenefits = watch("benefits") || [];
    setValue("benefits", currentBenefits.filter(benefit => benefit !== benefitToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => router.push("/dashboard/business")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors"
            >
              <HiArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <HiTrash className="h-4 w-4" />
              <span>{isDeleting ? 'Deleting...' : 'Delete Event'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
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

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="networking">Networking</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="seminar">Seminar</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Event Type */}
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <HiCalendar className="h-5 w-5 mr-2" />
              Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
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

              {/* End Date */}
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

              {/* Start Time */}
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

              {/* End Time */}
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
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <HiLocationMarker className="h-5 w-5 mr-2" />
              Location & Capacity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  {...register("location")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Max Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees *
                </label>
                <input
                  {...register("maxAttendees", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter max attendees"
                />
                {errors.maxAttendees && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxAttendees.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <HiCurrencyDollar className="h-5 w-5 mr-2" />
              Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Registration Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Fee
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

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  {...register("currency")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <HiTag className="h-5 w-5 mr-2" />
              Tags, Requirements & Benefits
            </h2>
            
            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(watch("tags") || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <HiX className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a requirement and press Enter"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(watch("requirements") || []).map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                  >
                    <span className="text-sm text-green-800">{requirement}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(requirement)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <HiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a benefit and press Enter"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(watch("benefits") || []).map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
                  >
                    <span className="text-sm text-purple-800">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <HiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
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
                  <p className="text-red-500 text-sm mt-1">{errors.contactInfo.email.message}</p>
                )}
              </div>

              {/* Phone */}
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
                {errors.contactInfo?.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactInfo.phone.message}</p>
                )}
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  {...register("contactInfo.website")}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.example.com"
                />
                {errors.contactInfo?.website && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactInfo.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <HiSave className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
