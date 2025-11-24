import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  code: string;
  city: string;
  country: string;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    city: String,
    country: String,
  },
  { timestamps: true }
);

export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);
