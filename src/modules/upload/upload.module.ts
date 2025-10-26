import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { CloudinaryService } from '../../shared/services/cloudinary.service';

@Module({
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class UploadModule {}

