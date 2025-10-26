import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile,
  UploadedFiles,
  Body,
  Get,
  Param,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';
import type { FileUploadOptions } from '../services/file-upload.service';
import { QueueService } from '../services/queue.service';

@Controller('upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly queueService: QueueService,
  ) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file', {
    storage: undefined, // Will be set by service
  }))
  async uploadSingleFile(
    @UploadedFile() file: any,
    @Body() options: FileUploadOptions = {},
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.fileUploadService.uploadFile(file, options);
    return {
      success: true,
      data: result,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: undefined, // Will be set by service
  }))
  async uploadMultipleFiles(
    @UploadedFiles() files: any[],
    @Body() options: FileUploadOptions = {},
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = await this.fileUploadService.uploadMultipleFiles(files, options);
    return {
      success: true,
      data: results,
    };
  }

  @Post('async')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAsync(
    @UploadedFile() file: any,
    @Body() body: { userId?: number; options?: FileUploadOptions } = {},
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    await this.fileUploadService.processFileAsync(file, body.userId);
    
    return {
      success: true,
      message: 'File upload job queued successfully',
    };
  }

  @Get('stats/:filename')
  async getFileStats(@Param('filename') filename: string) {
    const stats = await this.fileUploadService.getFileStats(filename);
    return {
      success: true,
      data: stats,
    };
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.fileUploadService.deleteFile(filename);
    return {
      success: true,
      message: 'File deleted successfully',
    };
  }

  @Get('queue/stats')
  async getQueueStats() {
    const emailStats = await this.queueService.getEmailQueueStats();
    const fileUploadStats = await this.queueService.getFileUploadQueueStats();
    const notificationStats = await this.queueService.getNotificationQueueStats();

    return {
      success: true,
      data: {
        email: emailStats,
        fileUpload: fileUploadStats,
        notification: notificationStats,
      },
    };
  }

  @Post('queue/clear')
  async clearQueues() {
    await this.queueService.clearEmailQueue();
    await this.queueService.clearFileUploadQueue();
    await this.queueService.clearNotificationQueue();

    return {
      success: true,
      message: 'All queues cleared successfully',
    };
  }
}
