import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: String,
  date: Date,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Todo: Model<ITodo> =
  (mongoose.models.Todo as Model<ITodo>) ||
  mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
