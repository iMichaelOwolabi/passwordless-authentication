import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config()

export const emailSender = async (to, firstName, token) => {
  const trasporter = await nodemailer.createTransport({
    host: process.env.MAILGUN_SMTP_HOSTNAME,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILGUN_SMTP_USERNAME,
      pass: process.env.MAILGUN_SMTP_PASSWORD,
    },
  });

  await trasporter.sendMail({
    from: `"Passwordless Auth" <nopassword@auth.com>`, // sender address
    to: `${to}`,
    subject: "Welcome to Passwordless Authentication",
    html: `<p><b>Hey ${firstName},</b></p> <p>You are welcome to the world of passwordless authentication. Kindly click the link below to login: </p>
    <a href='http://localhost:${process.env.PORT}/api/v1/auth/verify/${token}'>http://localhost:${process.env.PORT}/authenticate/${token}</a>.
    `,
  });
}
