import mongoose, { Schema } from "mongoose";

// Import Interface
import News from "./interface";

const postSchemal = new Schema<News>(
  {
    title: {
      type: String,
      maxLength: [50, "A post must have less of equal then 50 characters"],
      minLength: [10, "A post must have less of less then 10 characters"],
      required: [true, "A post must have a title"],
    },
    description: {
      type: String,
      maxLength: [500, "A post must have less of equal then 500 characters"],
      minLength: [10, "A post must have less of less then 10 characters"],
      required: [true, "A post must have a description"],
    },
    meta: {
      type: String,
      required: [true, "A post must have a meta"],
    },
  },
  {
    collection: "Post",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
postSchemal.virtual("comment", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchemal.virtual("like", {
  ref: "Like",
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model<News & mongoose.Document>("Post", postSchemal);

export default Post;
