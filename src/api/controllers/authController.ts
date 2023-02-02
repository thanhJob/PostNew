import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

// import config email
import { sendEmail } from "../../ultis/configEmail";

// User model
import User from "../models/User/userModel";

// signtoken
const keyToken: string = process.env.KEY_SIGNTOKEN ?? "";
const signToken = (model: any) => {
  return jwt.sign(model, keyToken, {
    expiresIn: process.env.EXPIRES_TOKEN,
  });
};

// create method conrrect password
const conrrect = async function (
  password: any,
  candidatePass: any
): Promise<boolean> {
  return await bcrypt.compare(password, candidatePass);
};

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.create(req.body);
    // console.log(user);
    if (!user) {
      console.log("Can't create data! Try again.");
      next();
    }

    const token = signToken(user.toJSON());
    res.status(200).json({
      status: "Successfully!",
      token,
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function logIn(req: Request, res: Response, next: NextFunction) {
  try {
    // check password email does not exits
    const { password, email } = req.body;
    if (!password || !email) {
      console.log("Invalid password or email!");
      next();
    }

    // check user does not exits
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    // console.log(user);
    if (!user) throw new Error("Can not find user or user does not exist!");
    // Features conrrectpass
    const comparePass: any = await conrrect(password, user.password);
    if (!comparePass) {
      throw new Error("Invalid password! Try again.");
    }

    const token: any = signToken(user.toJSON());
    res.status(201).json({
      status: "Successfully!",
      token,
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function security(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // check token
    let token;

    if (
      req.headers.authorization ||
      req.headers.authorization?.startsWith("Bearer")
    ) {
      token = req.headers.authorization?.split(" ")[1];
    }
    if (!token) {
      throw new Error("You not a login with token! Try again login.");
    }

    // check expires token
    const expiresToken = jwt.verify(token, keyToken);
    // check user exits with by token
    const currentUser = await User.findById(Object.values(expiresToken)[3]);
    if (!currentUser) {
      throw new Error("User does not exits with token! Pls try again.");
    }

    // delegate authority to user
    req.user = currentUser;

    next();
  } catch (err) {
    console.log(err);
  }
}

export function rectricted(...roles: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new Error("You do not have permission to perform this action!");
    }
    next();
  };
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // check user exits
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("user does not exits with token. Pls try again!");
    }

    // create method reset token password
    const methodResetToken = (Model: any) => {
      const token = crypto.randomBytes(32).toString("hex");

      Model.passwordResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      Model.passwordResetExpires = new Date(
        new Date().getTime() + 60 * 10 * 1000
        // create 10p expires reset
      );

      return token;
    };

    const resetToken = methodResetToken(user);
    user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password! Submit a patch request with your new password in here: \n
    ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: "Send to mail reset token password! (Invalid for 10 minute)",
      message: message,
    });

    res.status(201).json({
      status: "Successfully!",
    });
  } catch (err) {
    console.log(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $ne: new Date(Date.now()) },
    });

    // check user exits with token
    if (!user) {
      throw new Error("User does not exits with token!");
    }
    user.password = req.body.newPassword;
    // user.password = await bcrypt.hash(user.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    res.status(203).json({
      status: "Successfully!",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateMyPass(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // check user exits by token
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error(
        "Your a not login or user does not exits by token. Pls try again!"
      );
    }

    // check conrrect password
    const passCurrent = req.body.passwordCurrent;
    // check here update only pass
    if (!passCurrent || req.body.newPass) {
      throw new Error("This here update only password!");
    }
    const comparePass = await conrrect(passCurrent, user.password);
    if (!comparePass) {
      throw new Error(
        "Password current and your a password mismatched. Pls try again!"
      );
    }

    // update pass with body
    user.password = req.body.newPass;
    user.save();

    res.status(203).json({
      status: "Successfully!",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
}
