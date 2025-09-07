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
  HiUser
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getPostById, toggleLike, addComment } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormData } from "../../src/validation/schemas";

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

const PostDetailPage: NextPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post && currentUser) {
      setIsLiked(post.likes.some(like => like._id === currentUser._id));
      setLikesCount(post.likes.length);
      setComments(post.comments);
    }
  }, [post, currentUser]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data } = await getPostById(id as string, token);
      
      if (data.success) {
        setPost(data.data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to fetch post");
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const response = await toggleLike(post!._id, token);
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
      const response = await addComment(post!._id, data, token);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <button
            onClick={() => router.push('/posts')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Posts
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
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
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
                  <p className="text-sm text-gray-500 flex items-center">
                    <HiCalendar className="h-4 w-4 mr-1" />
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                {post.postType === 'business_proposal' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Business Proposal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Post Image */}
            {post.image?.url && (
              <div className="mt-6">
                <img
                  src={post.image.url}
                  alt="Post image"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <HiTag className="h-4 w-4 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
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

            {/* Business Proposal Details */}
            {post.postType === 'business_proposal' && post.businessProposal && (
              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Proposal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-blue-800">Industry:</span>
                      <span className="ml-2 text-blue-700">{post.businessProposal.industry}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Partnership Type:</span>
                      <span className="ml-2 text-blue-700 capitalize">
                        {post.businessProposal.partnershipType.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Investment Range:</span>
                      <span className="ml-2 text-blue-700">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: post.businessProposal.investmentAmount.currency,
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(post.businessProposal.investmentAmount.min)} - 
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: post.businessProposal.investmentAmount.currency,
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(post.businessProposal.investmentAmount.max)}
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
                  </div>
                  
                  <div className="space-y-4">
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
                </div>

                {/* Contact Information */}
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-3">Contact Information:</h5>
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
                        <HiShare className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Post Actions */}
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
              </div>

              <button className="text-gray-500 hover:text-gray-700">
                <HiShare className="h-6 w-6" />
              </button>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default PostDetailPage;
