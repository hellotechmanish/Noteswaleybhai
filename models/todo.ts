import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  date: Date;
  category: string;
  userId: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ["Urgent", "Non-Urgent"],
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // ✅ YE ADD KARO
);

const Todo: Model<ITodo> =
  (mongoose.models.Todo as Model<ITodo>) ||
  mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
