import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const mailerConfig = {
  service: "gmail",
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

export const mailTransporter = nodemailer.createTransport({
  service:mailerConfig.service,
  port: mailerConfig.port,
  secure: mailerConfig.port === 465,
  auth: mailerConfig.auth,
});
