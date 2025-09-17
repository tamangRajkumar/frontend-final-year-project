import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(4, "Password must be at least 4 characters long"),
});

export const signupSchema = z.object({
  fname: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lname: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(4, "Password must be at least 4 characters long").max(64, "Password must be less than 64 characters"),
  country: z.string().min(1, "Please select your country"),
  gender: z.string().min(1, "Please select your gender").refine((val) => ["Male", "Female", "Others"].includes(val), { message: "Please select a valid gender option" }),
  role: z.string().min(1, "Please select your account type").refine((val) => ["user", "business"].includes(val), { message: "Please select a valid account type" }),
});

export const businessSignupSchema = z.object({
  fname: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lname: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(4, "Password must be at least 4 characters long").max(64, "Password must be less than 64 characters"),
  country: z.string().min(1, "Please select your country"),
  gender: z.string().min(1, "Please select your gender").refine((val) => ["Male", "Female", "Others"].includes(val), { message: "Please select a valid gender option" }),
  role: z.literal("business"),
  businessName: z.string().min(1, "Business name is required").min(2, "Business name must be at least 2 characters").max(100, "Business name must be less than 100 characters"),
  businessType: z.string().min(1, "Please select your business type"),
  businessDescription: z.string().min(10, "Business description must be at least 10 characters").max(500, "Business description must be less than 500 characters"),
  businessWebsite: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  businessPhone: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must be less than 15 characters"),
  businessAddress: z.string().min(10, "Business address must be at least 10 characters").max(200, "Business address must be less than 200 characters"),
  kycDocumentType: z.string().min(1, "Please select document type").refine((val) => ["citizenship", "pan_card"].includes(val), { message: "Please select a valid document type" }),
  kycDocumentNumber: z.string().min(1, "Document number is required").min(5, "Document number must be at least 5 characters"),
  kycDocumentImage: z.any().refine((file) => file && file.length > 0, "Please upload your KYC document"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type BusinessSignupFormData = z.infer<typeof businessSignupSchema>;

// Post validation schemas
export const normalPostSchema = z.object({
  title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  image: z.any().optional(),
});

export const businessProposalSchema = z.object({
  title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  image: z.any().optional(),
  businessProposal: z.object({
    industry: z.string().min(1, "Industry is required"),
    investmentAmount: z.object({
      min: z.number().min(0, "Minimum amount must be positive"),
      max: z.number().min(0, "Maximum amount must be positive"),
      currency: z.string().default("USD"),
    }),
    partnershipType: z.enum(['equity', 'joint_venture', 'franchise', 'distribution', 'other'], {
      errorMap: () => ({ message: "Please select a valid partnership type" })
    }),
    location: z.string().min(1, "Location is required"),
    duration: z.string().min(1, "Duration is required"),
    requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
    benefits: z.array(z.string()).min(1, "At least one benefit is needed"),
    contactInfo: z.object({
      email: z.string().email("Please enter a valid email"),
      phone: z.string().optional(),
      website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
    }),
  }),
});

export const commentSchema = z.object({
  text: z.string().min(1, "Comment is required").min(1, "Comment cannot be empty").max(500, "Comment must be less than 500 characters"),
});

export const interestSchema = z.object({
  message: z.string().max(1000, "Message must be less than 1000 characters").optional(),
  contactInfo: z.object({
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
  }),
});

export const registrationSchema = z.object({
  eligibilityReason: z.string().min(1, "Eligibility reason is required").min(10, "Please provide a detailed reason (at least 10 characters)").max(1000, "Eligibility reason must be less than 1000 characters"),
  experience: z.string().max(500, "Experience description must be less than 500 characters").optional(),
  skills: z.array(z.string()).optional(),
  investmentCapacity: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: "Please select your investment capacity" })
  }).optional(),
  additionalInfo: z.string().max(1000, "Additional information must be less than 1000 characters").optional(),
  contactInfo: z.object({
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
  }),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  category: z.string().min(1, "Category is required"),
  eventType: z.enum(['online', 'offline', 'hybrid'], {
    errorMap: () => ({ message: "Please select a valid event type" })
  }),
  location: z.string().min(1, "Location is required").min(5, "Location must be at least 5 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  maxAttendees: z.number().min(1, "Maximum attendees must be at least 1").max(10000, "Maximum attendees cannot exceed 10,000"),
  registrationFee: z.number().min(0, "Registration fee cannot be negative").optional(),
  currency: z.string().default("USD"),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  contactInfo: z.object({
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  }),
  image: z.any().optional(),
}).refine((data) => {
  const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
  const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
  return startDateTime < endDateTime;
}, {
  message: "End date/time must be after start date/time",
  path: ["endDate"],
});

export const eventRegistrationSchema = z.object({
  additionalInfo: z.string().max(500, "Additional information must be less than 500 characters").optional(),
  contactInfo: z.object({
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
  }),
});

export type NormalPostFormData = z.infer<typeof normalPostSchema>;
export type BusinessProposalFormData = z.infer<typeof businessProposalSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type InterestFormData = z.infer<typeof interestSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;

// KYC validation schema
export const kycSchema = z.object({
  documentType: z.string().min(1, "Please select document type").refine((val) => ["citizenship", "passport", "pan_card"].includes(val), { message: "Please select a valid document type" }),
  documentNumber: z.string().min(1, "Document number is required").min(5, "Document number must be at least 5 characters"),
  documentImage: z.any().refine((file) => file && file.length > 0, "Please upload your KYC document"),
});

export type KYCFormData = z.infer<typeof kycSchema>;
