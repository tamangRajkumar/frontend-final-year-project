import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  HiHeart, 
  HiChat, 
  HiShare, 
  HiDotsVertical,
  HiBriefcase,
  HiCurrencyDollar,
  HiLocationMarker,
  HiClock,
  HiMail,
  HiPhone,
  HiGlobe,
  HiCheckCircle,
  HiXCircle,
  HiUser
} from "react-icons/hi";
import { toggleLike, addComment, expressInterest } from "../../pages/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, interestSchema, CommentFormData, InterestFormData } from "../../validation/schemas";

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  postType: 'normal' | 'business_proposal';
  postedBy: {
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
  businessProposal?: {
    industry: string;
    investmentAmount: {
      min: number;
      max: number;
      currency: string;
    };
    partnershipType: string;
    location: string;
    duration: string;
    requirements: string[];
    benefits: string[];
    contactInfo: {
      email: string;
      phone?: string;
      website?: string;
    };
    isActive: boolean;
    interestedParties: any[];
  };
  likes: any[];
  comments: any[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  onPostUpdate?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  // Check if current user liked the post
  React.useEffect(() => {
    if (currentUser) {
      setIsLiked(post.likes.some(like => like._id === currentUser._id));
    }
  }, [post.likes, currentUser]);

  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const interestForm = useForm<InterestFormData>({
    resolver: zodResolver(interestSchema),
  });

  const handleLike = async () => {
    if (!token) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const response = await toggleLike(post._id, token);
      if (response.data.success) {
        setIsLiked(response.data.data.isLiked);
        setLikesCount(response.data.data.likesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like post");
    }
  };

  const handleAddComment = async (data: CommentFormData) => {
    if (!token) {
      toast.error("Please login to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addComment(post._id, data, token);
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

  const handleExpressInterest = async (data: InterestFormData) => {
    if (!token) {
      toast.error("Please login to express interest");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await expressInterest(post._id, data, token);
      if (response.data.success) {
        toast.success("Interest expressed successfully!");
        setShowInterestModal(false);
        interestForm.reset();
        if (onPostUpdate) onPostUpdate();
      }
    } catch (error) {
      console.error("Error expressing interest:", error);
      toast.error("Failed to express interest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            {post.postedBy.userProfileImage?.url ? (
              <img
                src={post.postedBy.userProfileImage.url}
                alt={post.postedBy.fname}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-semibold">
                {post.postedBy.fname?.charAt(0)}{post.postedBy.lname?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.postedBy.fname} {post.postedBy.lname}
              {post.postedBy.businessInfo && (
                <span className="text-sm text-gray-500 ml-2">
                  ({post.postedBy.businessInfo.businessName})
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {post.postType === 'business_proposal' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <HiBriefcase className="h-3 w-3 mr-1" />
              Business Proposal
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {post.category}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
      </div>

      {/* Business Proposal Details */}
      {post.postType === 'business_proposal' && post.businessProposal && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <HiBriefcase className="h-4 w-4 mr-2" />
            Proposal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Industry:</span>
              <span className="ml-2 text-blue-700">{post.businessProposal.industry}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Partnership:</span>
              <span className="ml-2 text-blue-700 capitalize">
                {post.businessProposal.partnershipType.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Investment:</span>
              <span className="ml-2 text-blue-700">
                {formatCurrency(post.businessProposal.investmentAmount.min, post.businessProposal.investmentAmount.currency)} - 
                {formatCurrency(post.businessProposal.investmentAmount.max, post.businessProposal.investmentAmount.currency)}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Location:</span>
              <span className="ml-2 text-blue-700">{post.businessProposal.location}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Duration:</span>
              <span className="ml-2 text-blue-700">{post.businessProposal.duration}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Interested Parties:</span>
              <span className="ml-2 text-blue-700">{post.businessProposal.interestedParties.length}</span>
            </div>
          </div>

          {/* Requirements and Benefits */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-blue-800 mb-2">Requirements:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                {post.businessProposal.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-800 mb-2">Benefits:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                {post.businessProposal.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">Contact Information:</h5>
            <div className="flex flex-wrap gap-4 text-sm text-blue-700">
              <span className="flex items-center">
                <HiMail className="h-4 w-4 mr-1" />
                {post.businessProposal.contactInfo.email}
              </span>
              {post.businessProposal.contactInfo.phone && (
                <span className="flex items-center">
                  <HiPhone className="h-4 w-4 mr-1" />
                  {post.businessProposal.contactInfo.phone}
                </span>
              )}
              {post.businessProposal.contactInfo.website && (
                <a 
                  href={post.businessProposal.contactInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <HiGlobe className="h-4 w-4 mr-1" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Image */}
      {post.image?.url && (
        <div className="mb-4">
          <img
            src={post.image.url}
            alt="Post image"
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <HiHeart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <HiChat className="h-5 w-5" />
            <span>{comments.length}</span>
          </button>

          {post.postType === 'business_proposal' && currentUser?.role === 'business' && (
            <button
              onClick={() => setShowInterestModal(true)}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
            >
              <HiUser className="h-5 w-5" />
              <span>Express Interest</span>
            </button>
          )}
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          <HiShare className="h-5 w-5" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3">Comments ({comments.length})</h5>
          
          {/* Add Comment Form */}
          {token && (
            <form onSubmit={commentForm.handleSubmit(handleAddComment)} className="mb-4">
              <div className="flex space-x-2">
                <input
                  {...commentForm.register("text")}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
              {commentForm.formState.errors.text && (
                <p className="text-red-500 text-sm mt-1">
                  {commentForm.formState.errors.text.message}
                </p>
              )}
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {comment.postedBy.userProfileImage?.url ? (
                    <img
                      src={comment.postedBy.userProfileImage.url}
                      alt={comment.postedBy.fname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xs font-semibold">
                      {comment.postedBy.fname?.charAt(0)}{comment.postedBy.lname?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.postedBy.fname} {comment.postedBy.lname}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(comment.created)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Express Interest</h3>
                <button
                  onClick={() => setShowInterestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={interestForm.handleSubmit(handleExpressInterest)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    {...interestForm.register("message")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell them why you're interested..."
                  />
                  {interestForm.formState.errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {interestForm.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    {...interestForm.register("contactInfo.email")}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  {interestForm.formState.errors.contactInfo?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {interestForm.formState.errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Phone (Optional)
                  </label>
                  <input
                    {...interestForm.register("contactInfo.phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInterestModal(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Express Interest'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

