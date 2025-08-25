import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Or your SMTP host
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully to:", to);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
