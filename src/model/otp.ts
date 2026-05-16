import mongoose, { Schema, Document } from "mongoose";

interface IOtp extends Document {
  userId: mongoose.Types.ObjectId;
  otpCode: number;
  expiry: Date;
  createdAt: Date;
}

const schema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    otpCode: {
      type: Number,
      required: true,
    },

    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },

    collection: "otp",
  }
);

schema.index({ userId: 1, otpCode: 1 }, { unique: true });

const Otp = mongoose.model<IOtp>("Otp", schema);

export default Otp;