import express from "express";

// Controller
import {
  createLike,
  deleteLike,
  getAllLike,
} from "../controllers/likeController";

// Authentic
import { security } from "../controllers/authController";

const Router = express.Router({ mergeParams: true });

Router.route("/")
  .get(getAllLike)
  .post(security, createLike)
  .delete(security, deleteLike);

export default Router;
