import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Email Service - handles sending emails via Gmail SMTP
 * Uses the credentials from .env file
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@techive.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('✅ Email sent successfully to:', options.to);
    return true;
  } catch (error: any) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

export const sendOTPEmail = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { color: #333; margin-bottom: 20px; }
          .otp-box { background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Password Reset Request</h1>
          <p>Hi there,</p>
          <p>We received a request to reset your password. Use the OTP code below to proceed:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          
          <div class="footer">
            <p>Tech Hive © 2026 | All rights reserved</p>
            <p>This is an automated email, please do not reply to this address.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Your OTP for Password Reset - Tech Hive',
    html: htmlTemplate,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  resetLink: string
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p style="margin: 20px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #666;">
        © 2026 TechHive. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
  });
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to TechHive!</h2>
      <p>Hello ${name},</p>
      <p>Your account has been created successfully. You can now login to access all features.</p>
      <p style="margin: 20px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Login to Your Account
        </a>
      </p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #666;">
        © 2026 TechHive. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to TechHive!',
    html,
  });
};
