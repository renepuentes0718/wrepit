const bcrypt = require("bcryptjs");
const express = require("express");

const { User } = require("../database/schemas");

const { requireAuth } = require("./middleware");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports = router;

router.post("/validate-email", requireAuth, (req, res) => {
  const { email } = req.body;

  sendVerificationCode(email);
});

export async function sendVerificationCode(email) {
  const code = generateRandomNDigits(9);
  // isResetPassword = isResetPassword || false;
  // await pool.query(deleteVerificationCodes, [user_uuid, isResetPassword]);
  // const { insertId } = await pool.query(insertVerificationCode, [code, user_uuid, isResetPassword]);
  const { insertId } = await User.findByIdAndUpdate({ _id: email });
  const verificationURL = `${process.env.BASE_SITE_URL}verify?token=${jwt.sign(
    { user_uuid, email, code, insertId },
    process.env.TOKEN_SECRET
  )}`;
  await sendEmail({
    to: email,
    html:
      "<h1>Welcome to </h1><p>Thanks for signing up to </p><p>To verify your account <a href='" +
      verificationURL +
      "'>Click Here</a></p>",
    /* subject: isResetPassword ? 'Reset your password' : 'Verification Email', */
    subject: "Verification Email",
  });
}

export function generateRandomNDigits(n) {
  const c = Math.floor(100000 + Math.random() * 900000000).toString();
  if (c.length === n) {
    return c;
  } else {
    return generateRandomNDigits(n);
  }
}

export async function sendEmail(options) {
  const defaultOptions = {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_EMAIL,
    password: process.env.SMTP_GOOGLE_APP_PASSWORD_KEY,
    port: process.env.SMTP_PORT,
    from: "WREPIT <" + process.env.SMTP_EMAIL + ">",
    to: "",
    subject: "",
    html: "<p>If you are seeing this message, delete this email. This is likely an error</p>",
    attachments: [],
  };

  if (options) {
    const keys = Object.keys(options);
    keys.forEach((key) => {
      defaultOptions[key] = options[key];
    });
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: defaultOptions.host,
    port: defaultOptions.port,
    secure: defaultOptions.port === "465", // true for 465, false for other ports
    auth: {
      user: defaultOptions.user, // generated ethereal user
      pass: defaultOptions.password, // generated ethereal password
    },
    debug: true, // show debug output
    logger: true,
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  if (process.env.SMTP_IS_TESTING_MODE === "dev") {
    defaultOptions.to = process.env.SMTP_IS_TESTING_TARGET;
  }
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: defaultOptions.from, // sender address
    to: defaultOptions.to, // list of receivers
    subject: defaultOptions.subject, // Subject line
    html: defaultOptions.html, // html body
    attachments: defaultOptions.attachments,
    secure: defaultOptions.port === "465",
    debug: true,
  });

  return info.messageId;
}
