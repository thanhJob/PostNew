import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

// Import User
import User from "./interface";
import { NextFunction } from "express";

// method conrrect pass in interface
interface userMethod {
  conrrectPass(): boolean;
}

const userSchemal = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "A user must have a name!"],
    },
    address: {
      type: String,
      required: [true, "A user must have a address!"],
    },
    phone: {
      type: Number,
      required: [true, "A user must have a phone!"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email!"],
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minLength: [10, "Your password min length 10"],
    },
    createAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    role: {
      type: String,
      default: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    collection: "User",
  }
);

// Middleware
userSchemal.pre<User>("save", async function (next) {
  // hash password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// userSchemal.method("conrrectPass", async function conrrectPass(userPass: string) {
//   return await bcrypt.compare(this.password, userPass);
// });

userSchemal.methods.comparePassword = async function (
  candidatePass: string
): Promise<boolean> {
  return await bcrypt.compare(this.password, candidatePass);
};

const User = mongoose.model<User & mongoose.Document>("User", userSchemal);
export default User;
