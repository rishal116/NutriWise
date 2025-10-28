"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const mailer_1 = require("../configs/mailer");
const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
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
        const info = await mailer_1.mailTransporter.sendMail(mailOptions);
        console.log("✅ OTP email sent:", info.messageId);
    }
    catch (error) {
        console.error("❌ Failed to send OTP email:", error);
        throw new Error("Unable to send OTP email. Please try again later.");
    }
};
exports.sendOtpEmail = sendOtpEmail;
