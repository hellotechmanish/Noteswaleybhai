import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTPVerification extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPVerificationSchema = new Schema<IOTPVerification>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // faster lookup
    },
    otp: {
      type: String,
      required: true,
    },

    // Automatically delete document after expiration
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

const OTPVerification: Model<IOTPVerification> =
  mongoose.models.OTPVerification ||
  mongoose.model<IOTPVerification>("OTPVerification", OTPVerificationSchema);

export default OTPVerification;
