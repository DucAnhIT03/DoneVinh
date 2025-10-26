import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { EmailService } from '../services/email.service';

export interface EmailJobData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: any;
}

export interface FileUploadJobData {
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  userId?: number;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailJobData>) {
    this.logger.log(`Processing email job ${job.id}`);
    
    try {
      await this.emailService.sendEmail(job.data);
      this.logger.log(`Email job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}

@Processor('file-upload')
export class FileUploadProcessor {
  private readonly logger = new Logger(FileUploadProcessor.name);

  constructor() {}

  @Process('process-file')
  async handleFileUpload(job: Job<FileUploadJobData>) {
    this.logger.log(`Processing file upload job ${job.id}`);
    
    try {
      // Here you would implement file processing logic
      // For example: image resizing, virus scanning, cloud upload, etc.
      
      this.logger.log(`Processing file: ${job.data.originalName}`);
      this.logger.log(`File path: ${job.data.filePath}`);
      this.logger.log(`File size: ${job.data.size} bytes`);
      this.logger.log(`MIME type: ${job.data.mimeType}`);
      
      if (job.data.userId) {
        this.logger.log(`File uploaded by user: ${job.data.userId}`);
      }
      
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.logger.log(`File upload job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`File upload job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}

@Processor('notification')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor() {}

  @Process('send-notification')
  async handleNotification(job: Job<any>) {
    this.logger.log(`Processing notification job ${job.id}`);
    
    try {
      // Here you would implement notification logic
      // For example: push notifications, SMS, webhooks, etc.
      
      this.logger.log(`Sending notification: ${JSON.stringify(job.data)}`);
      
      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.logger.log(`Notification job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Notification job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}



