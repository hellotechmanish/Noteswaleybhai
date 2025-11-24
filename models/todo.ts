import mongoose, { Schema } from "mongoose";

const TodoShema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

const todo = mongoose.models.Todo || mongoose.model("Todo", TodoShema);

export default todo;
