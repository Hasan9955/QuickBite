import nodemailer from "nodemailer";
import config from "../config/index.js";

const sentEmailUtility = async (
  emailTo: string,
  EmailSubject: string,
  EmailText: string,
  EmailHTML: string
) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  });

  // Email options
  const mailOptions = {
    from: config.emailSender.email,
    to: emailTo,
    subject: EmailSubject,
    html: EmailHTML,
    text: EmailText,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sentEmailUtility;
