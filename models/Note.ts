import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  title: string;
  description?: string;
  university: string;
  course: string;
  year: string;
  semester: string;

  userId: mongoose.Types.ObjectId;

  fileUrl: string;
  supabaseSignedUrl: string;

  status: "pending" | "approved" | "rejected";
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
    title: { type: String, required: true },
    description: { type: String },

    university: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileUrl: { type: String, required: true },
    supabaseSignedUrl: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String },

    viewPrice: { type: Number, default: 5 },
    downloadPrice: { type: Number, default: 25 },

    earnedAmount: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ================================
// PREVENT RE-COMPILATION IN DEV
// ================================
const Note =
  (mongoose.models.Note as Model<INote>) ||
  mongoose.model<INote>("Note", NoteSchema);

export default Note;
