import z from "zod";

// Define UserRole enum as Zod enum (since we're no longer using @prisma/client)
const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

const registerUser = z.object({
  body: z.object({
    fullName: z.string().min(1, "User fullName is required!"),
    email: z
      .string()
      .email("Invalid email format!")
      .min(1, "Email is required!"),
    password: z
      .string()
      .min(6, "Password should be minimum 6 characters"),
    fcmToken: z.string().optional(),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format!")
      .min(1, "Email is required!"),
    password: z.string().min(1, "Password is required!"),
    fcmToken: z.string().optional(),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format!")
      .min(1, "Email is required!"),
  }),
});

const verifyOtp = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required!"),
    otpCode: z.number({
      // required_error: "otpCode is required!",
      // invalid_type_error: "otpCode must be a number",
    }),
    type: z.string().min(1, "type is required!"),
  }),
});

const resetPassword = z.object({
  body: z.object({
    newPassword: z
      .string()
      .min(6, "password should be minimum 6 characters"),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "old Password is required!"),
    newPassword: z
      .string()
      .min(6, "Password should be minimum 6 characters"),
  }),
});

// Partner registration schema
export const partnerRegistration = z.object({
  body: z.object({
    dateTimeFormat: z.string().min(1, "Data/time format is required"),
    timezone: z.string().min(1, "Timezone is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required")
      .max(255, "Email is too long")
      .trim(),
    phoneNumber: z
      .string()
      .regex(
        /^\+?\d{1,4}[\s-]?\(?\d{1,4}?\)?[\s-]?\d{1,4}[\s-]?\d{1,4}$/,
        "Invalid phone number format"
      )
      .min(10, "Mobile phone is required")
      .max(20, "Mobile phone number is too long"),
    password: z.string().min(8, "Password should have at least 8 characters"),
  }),
});

export const authValidation = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  partnerRegistration,
};

// Optional: Export UserRole type if needed elsewhere
export type UserRoleType = keyof typeof UserRole;