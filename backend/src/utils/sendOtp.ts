import { mailTransporter } from "../configs/mailer";
import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"NutriWise Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h3 style="color: #2b7cff;">${otp}</h3>
          <p>This code will expire in <b>1 minutes</b>.</p>
        </div>
      `,
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Unable to send OTP email. Please try again later.");
  }
};


export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: `"NutriWise Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password.</p>
          <p>Click the link below to reset it:</p>
          <a href="${resetLink}" style="color: #2b7cff;">Reset Password</a>
          <p>This link will expire in <b>1 hour</b>.</p>
        </div>
      `,
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log("✅ Reset password email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send reset password email:", error);
    throw new Error("Unable to send password reset email. Please try again later.");
  }
}

