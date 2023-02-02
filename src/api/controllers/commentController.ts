import express from "express";
import { Request, Response, NextFunction } from "express";

// Import Model
import Comment from "../models/Comment/commentModel";
import Post from "../models/News/newsModel";

export async function getAllComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comments = await Comment.find();
    if (!comments) {
      throw new Error("Can't found data!");
    }

    res.status(200).json({
      status: "Successfully!",
      length: comments.length,
      data: comments,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Allow nested routers
    if (!req.body.post) req.body.post = req.params.postId;
    if (!req.body.user) req.body.user = req.user.id;

    const newCmt = await Comment.create(req.body);
    if (!newCmt) {
      throw new Error("Can't create data. Try again later!");
    }

    res.status(201).json({
      status: "Successfully",
      data: newCmt,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateCmt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get post
    const post = await Post.findById(req.params.postId).populate("comment");
    // Get id cmt in post
    const cmtId = post.comment[0]._id;
    if (!cmtId) throw new Error("Comment does not exits!");

    // Update cmt
    const updateCmt = await Comment.findByIdAndUpdate(cmtId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateCmt) throw new Error("Can't update cmt. Try again!");

    res.status(203).json({
      status: "Successully!",
      data: updateCmt,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteCmt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get post
    const post = await Post.findById(req.params.postId).populate("comment");
    // Get id cmt in post
    const cmtId = post.comment[0]._id;
    if (!cmtId) throw new Error("Comment does not exits!");

    // Get cmt and delete
    await Comment.findByIdAndDelete(cmtId);
    res.status(204).json({
      status: "Successfully!",
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
}
