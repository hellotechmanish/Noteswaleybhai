// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUniversity extends Document {
//   name: string;
//   code: string;
//   city: string;
//   country: string;
// }

// const UniversitySchema = new Schema<IUniversity>(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     code: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     city: String,
//     country: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);

import mongoose from "mongoose";

const PaperSchema = new mongoose.Schema({
  year: { type: String, required: true },
  files: [{ type: String, required: true }],
});

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  papers: [PaperSchema],
});

const SemesterSchema = new mongoose.Schema({
  number: { type: String, required: true },
  subjects: [SubjectSchema],
});

const CourseSchema = new mongoose.Schema({
  University: { type: String, required: true },
  semesters: [SemesterSchema],
});

const UniversitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    courses: [CourseSchema],
  },
  { timestamps: true }
);

const University =
  mongoose.models.University || mongoose.model("University", UniversitySchema);

export default University;
