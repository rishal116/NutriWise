"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const mailer_1 = require("../config/mailer");
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: `"rishal99477@gmail.com" <${process.env.MAIL_USER}>`,
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
    await mailer_1.mailTransporter.sendMail(mailOptions);
};
exports.sendOtpEmail = sendOtpEmail;
