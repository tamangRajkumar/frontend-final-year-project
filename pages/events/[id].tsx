import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { 
  HiArrowLeft,
  HiHeart,
  HiChat,
  HiShare,
  HiTag,
  HiCalendar,
  HiUser,
  HiBriefcase,
  HiCurrencyDollar,
  HiLocationMarker,
  HiClock,
  HiMail,
  HiPhone,
  HiGlobe,
  HiCheckCircle,
  HiXCircle,
  HiUsers
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getEventById, toggleEventLike, addEventComment, registerForEvent, publishEvent, unpublishEvent } from "../api/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormData } from "../../src/validation/schemas";

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
    userProfileImage?: {
      url: string;
      public_id: string;
    };
    businessInfo?: {
      businessName: string;
      businessType: string;
    };
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
  registeredUsers: any[];
  likes: any[];
  comments: any[];
  isFeatured?: boolean;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

const EventDetailPage: NextPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    if (event && currentUser) {
      setIsLiked(event.likes.some(like => like._id === currentUser._id));
      setLikesCount(event.likes.length);
      setComments(event.comments);
      setIsRegistered(
        event.registeredUsers?.some(
          reg => reg.user._id === currentUser._id
        ) || false
      );
    }
  }, [event, currentUser]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await getEventById(id as string, token);
      
      if (data.success) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to fetch event");
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast.error("Please login to like events");
      return;
    }

    try {
      const response = await toggleEventLike(event!._id, token);
      if (response.data.success) {
        setIsLiked(response.data.data.isLiked);
        setLikesCount(response.data.data.likesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like event");
    }
  };

  const handleAddComment = async (data: CommentFormData) => {
    if (!token) {
      toast.error("Please login to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addEventComment(event!._id, data, token);
      if (response.data.success) {
        setComments([...comments, response.data.data]);
        commentForm.reset();
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = () => {
    if (!token) {
      toast.error("Please login to register for events");
      return;
    }

    if (!event?.isPublished) {
      toast.error("This event is not published yet");
      return;
    }

    setShowRegistrationModal(true);
  };

  const confirmRegistration = async () => {
    try {
      setIsSubmitting(true);
      const response = await registerForEvent(event!._id, {}, token);
      if (response.data.success) {
        toast.success("Registration successful!");
        setIsRegistered(true);
        fetchEvent(); // Refresh to get updated registration count
        setShowRegistrationModal(false);
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to register for event");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      const response = await publishEvent(event!._id, token);
      if (response.data.success) {
        toast.success("Event published successfully!");
        fetchEvent(); // Refresh to get updated event data
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      toast.error("Failed to publish event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setIsSubmitting(true);
      const response = await unpublishEvent(event!._id, token);
      if (response.data.success) {
        toast.success("Event unpublished successfully!");
        fetchEvent(); // Refresh to get updated event data
      }
    } catch (error) {
      console.error("Error unpublishing event:", error);
      toast.error("Failed to unpublish event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventFull = (registeredCount: number, maxAttendees: number) => {
    return registeredCount >= maxAttendees;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <HiArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <div className="p-6 border-b border-gray-200 bg-orange-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  {event.organizer.userProfileImage?.url ? (
                    <img
                      src={event.organizer.userProfileImage.url}
                      alt={event.organizer.fname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-orange-600 font-semibold text-sm">
                      {event.organizer.fname?.charAt(0)}{event.organizer.lname?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {event.organizer.businessInfo?.businessName || `${event.organizer.fname} ${event.organizer.lname}`}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <HiCalendar className="h-4 w-4 mr-1" />
                    {formatDate(event.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  <HiCalendar className="h-4 w-4 mr-1" />
                  Event
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {event.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.eventType)}`}>
                  {event.eventType}
                </span>
                {event?.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Featured
                  </span>
                )}
                {!event?.isPublished && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Event Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Image */}
            {event.image?.url && (
              <div className="mt-6">
                <img
                  src={event.image.url}
                  alt="Event image"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="mt-6 bg-orange-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <HiCalendar className="h-5 w-5 mr-2" />
                Event Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <HiCalendar className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <span className="font-medium text-orange-800">Start Date:</span>
                      <span className="ml-2 text-orange-700">{formatDate(event.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <HiCalendar className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <span className="font-medium text-orange-800">End Date:</span>
                      <span className="ml-2 text-orange-700">{formatDate(event.endDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <HiClock className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <span className="font-medium text-orange-800">Time:</span>
                      <span className="ml-2 text-orange-700">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <HiLocationMarker className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <span className="font-medium text-orange-800">Location:</span>
                      <span className="ml-2 text-orange-700">{event.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <HiUsers className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <span className="font-medium text-orange-800">Attendees:</span>
                      <span className="ml-2 text-orange-700">
                        {event.registeredUsers.length}/{event.maxAttendees}
                        {isEventFull(event.registeredUsers.length, event.maxAttendees) && (
                          <span className="text-red-600 font-medium ml-1">(Full)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {event.registrationFee > 0 && (
                    <div className="flex items-center">
                      <HiCurrencyDollar className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <span className="font-medium text-orange-800">Registration Fee:</span>
                        <span className="ml-2 text-orange-700">{formatCurrency(event.registrationFee, event.currency)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-orange-800">Event Type:</span>
                    <span className="ml-2 text-orange-700 capitalize">{event.eventType}</span>
                  </div>
                </div>
              </div>

              {/* Requirements and Benefits */}
              {(event.requirements.length > 0 || event.benefits.length > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.requirements.length > 0 && (
                    <div>
                      <h5 className="font-medium text-orange-800 mb-3">Requirements:</h5>
                      <ul className="text-sm text-orange-700 space-y-2">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <HiCheckCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {event.benefits.length > 0 && (
                    <div>
                      <h5 className="font-medium text-orange-800 mb-3">Benefits:</h5>
                      <ul className="text-sm text-orange-700 space-y-2">
                        {event.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <HiCheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-orange-200">
                <h5 className="font-medium text-orange-800 mb-3">Contact Information:</h5>
                <div className="flex flex-wrap gap-4 text-sm text-orange-700">
                  <span className="flex items-center">
                    <HiMail className="h-4 w-4 mr-2" />
                    {event.contactInfo.email}
                  </span>
                  {event.contactInfo.phone && (
                    <span className="flex items-center">
                      <HiPhone className="h-4 w-4 mr-2" />
                      {event.contactInfo.phone}
                    </span>
                  )}
                  {event.contactInfo.website && (
                    <a 
                      href={event.contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-orange-600 hover:text-orange-800"
                    >
                      <HiGlobe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <HiTag className="h-4 w-4 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Event Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <HiHeart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{likesCount}</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-500">
                  <HiChat className="h-6 w-6" />
                  <span className="font-medium">{comments.length}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-500">
                  <HiUsers className="h-6 w-6" />
                  <span className="font-medium">{event.registeredUsers.length}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Publish/Unpublish buttons for event owner */}
                {currentUser && currentUser._id === event.organizer._id && (
                  <>
                    {!event.isPublished ? (
                      <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <span>{isSubmitting ? 'Publishing...' : 'Publish Event'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleUnpublish}
                        disabled={isSubmitting}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <span>{isSubmitting ? 'Unpublishing...' : 'Unpublish Event'}</span>
                      </button>
                    )}
                  </>
                )}

                {/* Registration button for other users */}
                {currentUser && currentUser._id !== event.organizer._id && !isRegistered && !isEventFull(event.registeredUsers.length, event.maxAttendees) && event.isPublished && (
                  <button
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <HiUser className="h-4 w-4" />
                    <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
                  </button>
                )}
                
                {isRegistered && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <HiCheckCircle className="h-4 w-4 mr-1" />
                    Registered
                  </span>
                )}

                {!event.isPublished && currentUser && currentUser._id !== event.organizer._id && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <HiXCircle className="h-4 w-4 mr-1" />
                    Event Not Published
                  </span>
                )}

                {isEventFull(event.registeredUsers.length, event.maxAttendees) && !isRegistered && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <HiXCircle className="h-4 w-4 mr-1" />
                    Event Full
                  </span>
                )}

                <button className="text-gray-500 hover:text-gray-700">
                  <HiShare className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments ({comments.length})</h4>
            
            {/* Add Comment Form */}
            {token && (
              <form onSubmit={commentForm.handleSubmit(handleAddComment)} className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {currentUser?.userProfileImage?.url ? (
                      <img
                        src={currentUser.userProfileImage.url}
                        alt={currentUser.fname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-semibold text-sm">
                        {currentUser?.fname?.charAt(0)}{currentUser?.lname?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      {...commentForm.register("text")}
                      rows={3}
                      placeholder="Write a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                    {commentForm.formState.errors.text && (
                      <p className="text-red-500 text-sm mt-1">
                        {commentForm.formState.errors.text.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {comment.postedBy.userProfileImage?.url ? (
                      <img
                        src={comment.postedBy.userProfileImage.url}
                        alt={comment.postedBy.fname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-semibold text-sm">
                        {comment.postedBy.fname?.charAt(0)}{comment.postedBy.lname?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {comment.postedBy.fname} {comment.postedBy.lname}
                      </p>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(comment.created)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Confirmation Modal */}
        {showRegistrationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Event Registration
              </h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to register for <strong>"{event?.title}"</strong>?
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Event Details:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex items-center">
                      <HiCalendar className="h-4 w-4 mr-2" />
                      <span>{event?.startDate && formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <HiLocationMarker className="h-4 w-4 mr-2" />
                      <span>{event?.location}</span>
                    </div>
                    {event?.registrationFee && event.registrationFee > 0 && (
                      <div className="flex items-center">
                        <HiCurrencyDollar className="h-4 w-4 mr-2" />
                        <span>Registration Fee: {formatCurrency(event.registrationFee, event.currency)}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <HiUsers className="h-4 w-4 mr-2" />
                      <span>
                        {event?.registeredUsers?.length || 0}/{event?.maxAttendees} registered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRegistration}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <span>Yes, Register</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;