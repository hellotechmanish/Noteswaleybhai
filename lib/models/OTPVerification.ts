import mongoose, { Schema, Document } from "mongoose";

export interface IOTPVerification extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPVerificationSchema = new Schema<IOTPVerification>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // index: { expires: 0 }, // Auto-delete expired OTPs
    },
  },
  { timestamps: true }
);

export default mongoose.models.OTPVerification ||
  mongoose.model<IOTPVerification>("OTPVerification", OTPVerificationSchema);
