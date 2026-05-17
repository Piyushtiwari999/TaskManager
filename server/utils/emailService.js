const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TaskFlow Pro" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

const sendInviteEmail = async (email, inviterName) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #6366f1;">You're Invited to TaskFlow Pro!</h2>
      <p>Hello,</p>
      <p><strong>${inviterName}</strong> has invited you to join their team on <strong>TaskFlow Pro</strong>.</p>
      <p>Collaborate on projects, manage tasks, and boost your productivity with our modern SaaS platform.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?email=${email}" 
           style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Join the Team
        </a>
      </div>
      <p style="font-size: 12px; color: #666;">If you didn't expect this invitation, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">&copy; 2026 TaskFlow Pro SaaS. All rights reserved.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: `${inviterName} invited you to TaskFlow Pro`,
    html,
  });
};

module.exports = { sendInviteEmail };
