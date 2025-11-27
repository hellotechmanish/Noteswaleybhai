import mongoose from "mongoose";
export interface IPyquation extends mongoose.Document {
  year: string;
  university: string;
  course: string;
  semester: string;
  questionPaperUrl: string;
  userId: mongoose.Types.ObjectId;
}

const PrevYearquation = new mongoose.Schema({
  year: { type: String, required: true },
  university: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: String, required: true },
  questionPaperUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: Date.now },
});

// this is the test comment
const Pyquation =
  mongoose.models.Pyquation<IPyquation> ||
  mongoose.model<IPyquation>("Pyquation", PrevYearquation);
