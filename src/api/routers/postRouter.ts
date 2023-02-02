import express from "express";

// CONTROLLER
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postController";

// CONTROLLER AUTHENTIC
import { rectricted, security } from "../controllers/authController";

// Import Comment
import { createComment } from "../controllers/commentController";
import commentRouter from "./commentRouter";

// Import Like
import likeRouter from "./likeRouter";

const Router = express.Router();

// // Create Comment on Post
// Router.route("/:postId/comment").post(security, createComment);

Router.use("/:postId/comment", commentRouter);
Router.use("/:postId/deleteCmt", commentRouter);
Router.use("/:postId/updateCmt", commentRouter);

// Create like on Post
Router.use("/:postId/like", likeRouter);
// Delete like on Post
Router.use("/:postId/deleteLike", likeRouter);

// Params
Router.route("/")
  .get(security, rectricted("Admin"), getAllPosts)
  .post(createPost);

// Params ID
Router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

export default Router;
