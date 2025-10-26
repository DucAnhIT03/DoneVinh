import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, Job } from 'bull';

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

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('file-upload') private readonly fileUploadQueue: Queue,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  // Email Queue Methods
  async addEmailJob(data: EmailJobData, options?: any): Promise<Job<EmailJobData>> {
    return this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      ...options,
    });
  }

  async addBulkEmailJob(emails: EmailJobData[], options?: any): Promise<Job<EmailJobData[]>[]> {
    const jobs = emails.map(email => 
      this.emailQueue.add('send-email', email, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        ...options,
      })
    );
    return Promise.all(jobs);
  }

  // File Upload Queue Methods
  async addFileUploadJob(data: FileUploadJobData, options?: any): Promise<Job<FileUploadJobData>> {
    return this.fileUploadQueue.add('process-file', data, {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
      ...options,
    });
  }

  async addBulkFileUploadJob(files: FileUploadJobData[], options?: any): Promise<Job<FileUploadJobData[]>[]> {
    const jobs = files.map(file => 
      this.fileUploadQueue.add('process-file', file, {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
        ...options,
      })
    );
    return Promise.all(jobs);
  }

  // Notification Queue Methods
  async addNotificationJob(data: any, options?: any): Promise<Job<any>> {
    return this.notificationQueue.add('send-notification', data, {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 3000,
      },
      ...options,
    });
  }

  // Queue Management Methods
  async getEmailQueueStats() {
    const waiting = await this.emailQueue.getWaiting();
    const active = await this.emailQueue.getActive();
    const completed = await this.emailQueue.getCompleted();
    const failed = await this.emailQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async getFileUploadQueueStats() {
    const waiting = await this.fileUploadQueue.getWaiting();
    const active = await this.fileUploadQueue.getActive();
    const completed = await this.fileUploadQueue.getCompleted();
    const failed = await this.fileUploadQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async getNotificationQueueStats() {
    const waiting = await this.notificationQueue.getWaiting();
    const active = await this.notificationQueue.getActive();
    const completed = await this.notificationQueue.getCompleted();
    const failed = await this.notificationQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async clearEmailQueue() {
    await this.emailQueue.empty();
    this.logger.log('Email queue cleared');
  }

  async clearFileUploadQueue() {
    await this.fileUploadQueue.empty();
    this.logger.log('File upload queue cleared');
  }

  async clearNotificationQueue() {
    await this.notificationQueue.empty();
    this.logger.log('Notification queue cleared');
  }

  async pauseEmailQueue() {
    await this.emailQueue.pause();
    this.logger.log('Email queue paused');
  }

  async resumeEmailQueue() {
    await this.emailQueue.resume();
    this.logger.log('Email queue resumed');
  }
}



