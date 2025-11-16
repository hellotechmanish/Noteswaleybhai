import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  universityId: mongoose.Types.ObjectId;
  duration: number;
  degree: string;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    universityId: {
      type: Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    duration: Number,
    degree: String,
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
