import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export function generateOTPEmail(email: string, otp: string) {
  return {
    to: email,
    subject: 'Verify your SmartStay account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">SmartStay</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your verification code</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">Verify Your Email</h2>
          
          <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">Your verification code is:</p>
            <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #666; margin: 20px 0; font-size: 14px; text-align: center;">
            This code will expire in <strong>15 minutes</strong>.
          </p>
          
          <p style="color: #666; margin: 20px 0; font-size: 14px; text-align: center;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 SmartStay. All rights reserved.</p>
        </div>
      </div>
    `,
  };
}
