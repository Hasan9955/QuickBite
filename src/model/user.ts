import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  socialLoginType: string;
  address?: string;
  fcmToken?: string;
  phone?: string;
  isDeleted: boolean;
  isVerified: boolean;
  isNotify: boolean;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },

    socialLoginType: {
      type: String,
      enum: ["EMAIL_PASSWORD", "GOOGLE", "FACEBOOK"],
      default: "EMAIL_PASSWORD",
    },

    address: {
      type: String,
    },

    fcmToken: {
      type: String,
    },

    phone: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isNotify: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const User = mongoose.model<IUser>("User", schema);

export default User;