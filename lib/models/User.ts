import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isverify: boolean;
  role: "student";
  university?: string;
  totalEarnings: number;
  notes: [string];

  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    isverify: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },
    university: String,
    totalEarnings: {
      type: Number,
      default: 0,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

// ----------------------------
// HASH PASSWORD BEFORE SAVE
// ----------------------------
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ----------------------------
// COMPARE PASSWORD METHOD
// ----------------------------
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
