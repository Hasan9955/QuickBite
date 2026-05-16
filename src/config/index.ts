import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "12",
  otp_expiry_time: process.env.OTP_ACCESS_EXPIRES_IN || "5",
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

    reset_pass_secret: process.env.JWT_RESET_PASS_SECRET,
    reset_pass_token_expires_in: process.env.JWT_RESET_PASS_EXPIRES_IN,
  },
  S3: {
    space_endpoint: process.env.SPACE_ENDPOINT,
    space_origin_endpoint: process.env.SPACE_ORIGIN_ENDPOINT,
    space_accesskey: process.env.SPACE_ACCESS_KEY,
    space_secret_key: process.env.SPACE_SECRET_KEY,
    space_bucket: process.env.SPACE_BUCKET,
    space_bucket_region: process.env.SPACE_BUCKET_REGION,
  },
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.EMAIL_PASSWORD,
    contact_mail_address: process.env.CONTACT_MAIL_ADDRESS,
  },
};
