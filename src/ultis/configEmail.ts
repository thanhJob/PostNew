import nodemailer from "nodemailer";

export async function sendEmail(options: any) {
  let transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: 2525,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    },
  });

  let infor = await transporter.sendMail({
    from: "ThanhJob <thanhjobb@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  });
}
