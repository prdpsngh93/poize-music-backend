const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, otp) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333;">
      <h2 style="text-align: center; color: #4a90e2;">🎵 Music Auth</h2>
      <p>Hi there,</p>
      <p>You recently requested to verify your identity. Use the following OTP code:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; padding: 10px 20px; background-color: #4a90e2; color: white; font-size: 24px; border-radius: 5px; letter-spacing: 3px;">
          ${otp}
        </span>
      </div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      <p>Best regards,<br><strong>Music Auth Team</strong></p>
      <hr style="margin-top: 40px;">
      <p style="font-size: 12px; color: #888;">If you did not request this email, you can safely ignore it.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Music Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlTemplate,
  });
};

module.exports = sendMail;
