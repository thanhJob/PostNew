import express from "express";
import { Request, Response, NextFunction } from "express";

// User model
import User from "../models/User/userModel";

const filterObj = (obj: any, ...allKetField: any) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allKetField.include(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

export async function getAllUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await User.find();
    if (!users) {
      console.log("Can't find data! Try again.");
      next();
    }

    res.status(200).json({
      status: "Successfully!",
      length: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err);
  }
}

// Get By ID
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("Can't find data! Try again.");
      next();
    }

    res.status(200).json({
      status: "Successfully!",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}

// Update By ID
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      console.log("Can't update data! Try again.");
      next();
    }

    res.status(203).json({
      status: "Successfully!",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}

// Delete By ID
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      console.log("Can't delete data! Try again.");
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

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User does not exits!");
    }

    res.status(200).json({
      status: "Successfully!",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(203).json({
      status: "Successfully!",
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filterKeys = filterObj("name", "email", "phone", "age");
    const me = await User.findByIdAndUpdate(req.user.id, filterKeys, {
      runValidators: true,
      new: true,
    });

    res.status(203).json({
      status: "Successfully!",
      data: me,
    });
  } catch (err) {
    console.log(err);
  }
}
