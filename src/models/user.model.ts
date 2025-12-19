import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

/* ============================
   USER INTERFACE
============================ */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(candidate: string): Promise<boolean>;
}

/* ============================
   USER SCHEMA
============================ */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

/* ============================
   HASH PASSWORD BEFORE SAVE
============================ */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as any);
  }
});

/* ============================
   COMPARE PASSWORD METHOD
============================ */
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

/* ============================
   CREATE & EXPORT MODEL
============================ */
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
