import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  courseId: mongoose.Types.ObjectId;
  semester: number;
  credits: number;
}

// this is  the schema for subjects

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: Number,
    credits: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
