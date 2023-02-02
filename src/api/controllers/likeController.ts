import express from "express";
import { Request, Response, NextFunction } from "express";

// Import model
import Like from "../models/Like/likeModel";
import Post from "../models/News/newsModel";

export async function getAllLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const likes = await Like.find();
    if (!likes) {
      throw new Error("Can't found data!");
    }

    res.status(200).json({
      status: "Successfully!",
      data: likes,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function createLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body.like) req.body.like = req.user.id;
    if (!req.body.post) req.body.post = req.params.postId;
    const newLike = await Like.create(req.body);
    if (!newLike) {
      throw new Error("Can't create data.Try again!");
    }
    res.status(200).json({
      status: "Successfully!",
      data: newLike,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get like id from post
    const post = await Post.findById(req.params.postId).populate("like");
    const like = post.like[0]._id;
    if (!like) throw new Error("Like does not exits on post!");

    // Get id and delete like
    await Like.findByIdAndDelete(like);
    res.status(204).json({
      status: "Successfully!",
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
}
