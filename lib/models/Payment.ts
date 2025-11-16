import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  noteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  earnedAmount: number;
  razorpayPaymentId: string;
  status: 'completed' | 'failed';
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    noteId: {
      type: Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    earnedAmount: {
      type: Number,
      required: true,
    },
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
