import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { QueueService } from '../services/queue.service';

@Controller('email-test')
export class EmailTestController {
  constructor(
    private readonly emailService: EmailService,
    private readonly queueService: QueueService,
  ) {}

  @Post('send')
  async sendTestEmail(@Body() body: { to: string; subject?: string; message?: string }) {
    try {
      const { to, subject = 'Test Email', message = 'This is a test email from Bus Ticket API' } = body;
      
      await this.emailService.sendEmail({
        to,
        subject,
        html: `
          <h1>Test Email</h1>
          <p>${message}</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        `
      });

      return {
        success: true,
        message: 'Email sent successfully',
        to,
        subject
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email',
        error: error.message
      };
    }
  }

  @Post('welcome')
  async sendWelcomeEmail(@Body() body: { to: string; name: string }) {
    try {
      const { to, name } = body;
      
      await this.emailService.sendWelcomeEmail(to, name);

      return {
        success: true,
        message: 'Welcome email sent successfully',
        to,
        name
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send welcome email',
        error: error.message
      };
    }
  }

  @Post('queue')
  async sendEmailViaQueue(@Body() body: { to: string; subject: string; message: string }) {
    try {
      const { to, subject, message } = body;
      
      await this.queueService.addEmailJob({
        to,
        subject,
        html: `
          <h1>Queue Email</h1>
          <p>${message}</p>
          <p>Sent via queue at: ${new Date().toLocaleString()}</p>
        `
      });

      return {
        success: true,
        message: 'Email job added to queue',
        to,
        subject
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add email job to queue',
        error: error.message
      };
    }
  }

  @Get('config')
  async getEmailConfig() {
    return {
      success: true,
      config: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || '587',
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-4) : 'Not configured',
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'Not configured'
      }
    };
  }
}


