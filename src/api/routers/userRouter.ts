import express from "express";
import {
  forgotPassword,
  logIn,
  rectricted,
  resetPassword,
  security,
  signUp,
  updateMyPass,
} from "../controllers/authController";
import {
  deleteMe,
  deleteUser,
  getAllUser,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/userController";

const Router = express.Router();

// Authentic Account
Router.post("/signUp", signUp);
Router.post("/logIn", logIn);
Router.post("/forgotPassword", forgotPassword);
Router.patch("/resetPassword/:token", resetPassword);
Router.patch("/updateMyPass", security, updateMyPass);
Router.get("/getMe", security, getMe);
Router.patch("/updateMe", security, updateMe);
Router.delete("/deleteMe", security, deleteMe);

// Params
Router.route("/").get(getAllUser);

// Params ID
Router.route("/:id")
  .get(security, rectricted("Admin"), getUser)
  .patch(updateUser)
  .delete(deleteUser);
export default Router;
