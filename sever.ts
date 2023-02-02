import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
import app from "./index";

import { Request, Response, NextFunction } from "express";

// Connect Data
const dataURL = process.env.DATA;
if (!dataURL) {
  console.log("Invalid url connect data!");
} else {
  mongoose
    .connect(dataURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then((doc) => {
      // console.log(doc);
      console.log("Connect data mongoDB successfully!");
    })
    .catch((err) => {
      console.log(err);
    });
}

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`App listen running at port: ${port}`);
});
