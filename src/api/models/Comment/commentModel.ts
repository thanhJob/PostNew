import mongoose from "mongoose";
import { Schema } from "mongoose";

// Import interface
import Comment from "./interface";

const commentSchemal = new Schema<Comment>(
  {
    comment: {
      type: String,
      required: [true, "A comment must have a description!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user."],
    },
  },
  {
    collection: "Comment",
  }
);

// Middleware

commentSchemal.pre<Comment>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
const Comment = mongoose.model<Comment & mongoose.Document>(
  "Comment",
  commentSchemal
);

export default Comment;
