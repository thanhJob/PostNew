import mongoose from "mongoose";
import { Schema } from "mongoose";

// Import interface
import Like from "./interface";

const likeSchemal = new Schema<Like>(
  {
    like: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like must belong"],
    },
    createAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Like must belong to a post!"],
    },
  },
  {
    collection: "Like",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

likeSchemal.pre<Like>(/^find/, function (next) {
  this.populate({
    path: "like",
    select: "name",
  });
  next();
});

const Like = mongoose.model<Like & mongoose.Document>("Like", likeSchemal);

export default Like;
