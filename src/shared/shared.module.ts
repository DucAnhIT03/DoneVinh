import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './services/email.service';
import { QueueService } from './services/queue.service';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadController } from './controllers/file-upload.controller';
import { EmailTestController } from './controllers/email-test.controller';
import { EmailProcessor } from './processors/queue.processors';
import { FileUploadProcessor } from './processors/queue.processors';
import { NotificationProcessor } from './processors/queue.processors';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'file-upload' },
      { name: 'notification' },
    ),
  ],
  providers: [
    EmailService,
    QueueService,
    FileUploadService,
    EmailProcessor,
    FileUploadProcessor,
    NotificationProcessor,
  ],
  controllers: [FileUploadController, EmailTestController],
  exports: [
    EmailService,
    QueueService,
    FileUploadService,
  ],
})
export class SharedModule {}

