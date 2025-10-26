import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
const multer = require('multer');
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  destination?: string;
}

export interface FileUploadResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  url?: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadPath = process.env.UPLOAD_PATH || './uploads';

  constructor(
    @InjectQueue('file-upload') private readonly fileUploadQueue: Queue,
  ) {
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getMulterConfig(options: FileUploadOptions = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      destination = this.uploadPath,
    } = options;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });

    const fileFilter = (req: any, file: any, cb: any) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException(`File type ${file.mimetype} is not allowed`), false);
      }
    };

    const multerInstance = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxSize,
      },
    });
    
    return multerInstance;
  }

  async uploadFile(file: any, options: FileUploadOptions = {}): Promise<FileUploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.validateFile(file, options);

    const result: FileUploadResult = {
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
      url: await this.getFileUrl(file.filename),
    };

    this.logger.log(`File uploaded: ${file.originalname} -> ${file.filename}`);
    return result;
  }

  async uploadMultipleFiles(files: any[], options: FileUploadOptions = {}): Promise<FileUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results: FileUploadResult[] = [];
    
    for (const file of files) {
      this.validateFile(file, options);
      
      const result: FileUploadResult = {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype,
        url: await this.getFileUrl(file.filename),
      };
      
      results.push(result);
    }

    this.logger.log(`Multiple files uploaded: ${files.length} files`);
    return results;
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadPath, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`File deleted: ${filename}`);
      } else {
        this.logger.warn(`File not found: ${filename}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file ${filename}: ${error.message}`);
      throw error;
    }
  }

  async getFileUrl(filename: string): Promise<string> {
    return `${process.env.APP_URL || 'http://localhost:3000'}/uploads/${filename}`;
  }

  async getFileStats(filename: string): Promise<any> {
    const filePath = path.join(this.uploadPath, filename);
    
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
      };
    } catch (error) {
      this.logger.error(`Failed to get file stats for ${filename}: ${error.message}`);
      throw new BadRequestException(`File ${filename} not found`);
    }
  }

  private validateFile(file: any, options: FileUploadOptions = {}): void {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    } = options;

    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${maxSize} bytes`);
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }
  }

  async processFileAsync(file: any, userId?: number): Promise<void> {
    const fileData = {
      filePath: file.path,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      userId,
    };

    await this.fileUploadQueue.add('process-file', fileData, {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
    });

    this.logger.log(`File processing job added for: ${file.originalname}`);
  }
}
