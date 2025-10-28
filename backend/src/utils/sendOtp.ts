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
          <p>This code will expire in <b>5 minutes</b>.</p>
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

