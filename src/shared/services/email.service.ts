import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.createTransporter();
  }

  private createTransporter() {
    // Debug environment variables
    console.log('🔍 Email Config Debug:');
    console.log('MAIL_HOST:', process.env.MAIL_HOST);
    console.log('MAIL_PORT:', process.env.MAIL_PORT);
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASS:', process.env.MAIL_PASS ? '***HIDDEN***' : 'NOT SET');
    console.log('MAIL_FROM:', process.env.MAIL_FROM);
    
    const config = {
      host: process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '587'),
      secure: process.env.MAIL_SECURE === 'true' || process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER || process.env.SMTP_USER,
        pass: process.env.MAIL_PASS || process.env.SMTP_PASS,
      },
    };
    
    console.log('📧 Final Email Config:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user,
      pass: config.auth.pass ? '***HIDDEN***' : 'NOT SET'
    });
    
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.MAIL_USER || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const html = `
      <h1>Welcome to Bus Ticket System!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>Best regards,<br>Bus Ticket Team</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Welcome to Bus Ticket System',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html,
    });
  }

  async sendBookingConfirmationEmail(to: string, bookingDetails: any): Promise<void> {
    const html = `
      <h1>Booking Confirmation</h1>
      <p>Your booking has been confirmed!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Route: ${bookingDetails.route}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.time}</li>
        <li>Seats: ${bookingDetails.seats.join(', ')}</li>
        <li>Total: $${bookingDetails.total}</li>
      </ul>
      <p>Thank you for choosing our service!</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Booking Confirmation',
      html,
    });
  }
}

