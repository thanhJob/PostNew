import express, { request } from "express";
import morgan from "morgan";

import { Request, Response, NextFunction } from "express";

// ROUTER
import postRouter from "./src/api/routers/postRouter";
import userRouter from "./src/api/routers/userRouter";
import commentRouter from "./src/api/routers/commentRouter";
import likeRouter from "./src/api/routers/likeRouter";

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (app.use(morgan("dev"))) {
  console.log(process.env.DEV);
}

// MIDLEWARE ROUTER
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

export default app;
