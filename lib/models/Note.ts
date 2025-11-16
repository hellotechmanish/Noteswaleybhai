import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  subjectId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileUrl: string;
  supabaseSignedUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  viewPrice: number;
  downloadPrice: number;
  earnedAmount: number;
  downloads: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    supabaseSignedUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    viewPrice: {
      type: Number,
      default: 5,
    },
    downloadPrice: {
      type: Number,
      default: 25,
    },
    earnedAmount: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
