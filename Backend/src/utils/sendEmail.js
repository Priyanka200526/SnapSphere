import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  await transporter.sendMail({
    from: `"SnapSphere" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });

}