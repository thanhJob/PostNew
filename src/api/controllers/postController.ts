import express from "express";
import { Request, Response, NextFunction } from "express";

// MODEL
import Post from "../models/News/newsModel";

// Get all post
export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await Post.find();
    if (!posts) {
      console.log("Cant not find data! Try again later.");
      next();
    }
    // const time = Date.toString().toLocaleUpperCase();
    const time = new Date(Date.now());
    res.status(200).json({
      status: "Successfully!",
      time: time,
      length: posts.length,
      data: posts,
    });
  } catch (err) {
    console.log(err);
  }
}

// Create new post
export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newPost = await Post.create(req.body);
    if (!newPost) {
      console.log("Can't create new post! Try again later.");
      next();
    }

    res.status(201).json({
      status: "Successfully!",
      data: newPost,
    });
  } catch (err) {
    console.log(err);
  }
}

// Get post by ID
export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate(
      "comment like"
    );
    if (!post) {
      console.log("Cant not find data! Try again later.");
      next();
    }

    res.status(200).json({
      status: "Successfully!",
      data: post,
    });
  } catch (err) {
    console.log(err);
  }
}

// Update post
export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      console.log("Can't not update data! Try again later.");
      next();
    }

    res.status(203).json({
      status: "Successfully!",
      data: post,
    });
  } catch (err) {
    console.log(err);
  }
}

// Delete post
export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      console.log("Can't not delete data! Try again later.");
      next();
    }

    res.status(204).json({
      status: "Successfully!",
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
}
