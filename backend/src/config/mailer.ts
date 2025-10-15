import nodemailer from "nodemailer";

export const mailerConfig = {
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER || "your_email@gmail.com",
    pass: process.env.MAIL_PASS || "your_email_app_password",
  },
};

export const mailTransporter = nodemailer.createTransport({
  host: mailerConfig.host,
  port: mailerConfig.port,
  secure: mailerConfig.port === 465,
  auth: mailerConfig.auth,
});
