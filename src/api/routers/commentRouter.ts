import express from "express";

// Controller
import {
  createComment,
  deleteCmt,
  getAllComment,
  updateCmt,
} from "../controllers/commentController";

// Import authentic
import { security } from "../controllers/authController";

const Router = express.Router({ mergeParams: true });

Router.route("/")
  .get(getAllComment)
  .post(security, createComment)
  .patch(security, updateCmt)
  .delete(security, deleteCmt);

export default Router;
