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

// Year-wise papers
const PaperSchema = new mongoose.Schema({
  year: { type: String, required: true }, // e.g., "2024-2025", "2023"
  files: [{ type: String, required: true }], // PDFs URLs
});

// Subjects inside semester
const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Mathematics"
  papers: [PaperSchema], // years + files[]
});

// Semester inside course
const SemesterSchema = new mongoose.Schema({
  number: { type: String, required: true }, // e.g., "1", "2"
  subjects: [SubjectSchema],
});

// Course inside university
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "BCA", "B.Sc CS"
  semesters: [SemesterSchema],
});

// Main University schema
const UniversitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    courses: [CourseSchema],
  },
  { timestamps: true }
);

export default mongoose.models.University ||
  mongoose.model("University", UniversitySchema);
