import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RemoveImageDto } from '../dtos/remove-image.dto';
import { RemoveMultipleImagesDto } from '../dtos/remove-multiple-images.dto';
import { TransformImageDto } from '../dtos/transform-image.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Upload single image
   */
  @Post('single')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    try {
      const result = await this.cloudinaryService.uploadSingleImage(file, folder);
      
      return {
        success: true,
        message: 'Image uploaded successfully',
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Upload multiple images
   */
  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 files
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type for ${file.originalname}. Only JPEG, PNG, GIF, and WebP are allowed`);
      }
      
      if (file.size > maxSize) {
        throw new BadRequestException(`File size too large for ${file.originalname}. Maximum size is 5MB`);
      }
    }

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(files, folder);
      
      return {
        success: true,
        message: `${results.length} images uploaded successfully`,
        data: results
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Remove single image
   */
  @Delete('single')
  @UseGuards(JwtAuthGuard)
  async removeSingle(@Body() removeImageDto: RemoveImageDto) {
    try {
      const result = await this.cloudinaryService.removeImage(removeImageDto.publicId);
      
      return {
        success: result.success,
        message: result.message,
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Remove multiple images
   */
  @Delete('multiple')
  @UseGuards(JwtAuthGuard)
  async removeMultiple(@Body() removeMultipleImagesDto: RemoveMultipleImagesDto) {
    try {
      const results = await this.cloudinaryService.removeMultipleImages(removeMultipleImagesDto.publicIds);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      return {
        success: true,
        message: `Removed ${successCount} images successfully, ${failCount} failed`,
        data: results
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get image information
   */
  @Post('info')
  @UseGuards(JwtAuthGuard)
  async getImageInfo(@Body('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    try {
      const result = await this.cloudinaryService.getImageInfo(publicId);
      
      return {
        success: true,
        message: 'Image information retrieved successfully',
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Transform image URL
   */
  @Post('transform')
  @UseGuards(JwtAuthGuard)
  async transformImage(@Body() transformImageDto: TransformImageDto) {
    try {
      const transformedUrl = this.cloudinaryService.transformImageUrl(
        transformImageDto.publicId,
        transformImageDto.transformations
      );
      
      return {
        success: true,
        message: 'Image URL transformed successfully',
        data: {
          public_id: transformImageDto.publicId,
          transformed_url: transformedUrl,
          transformations: transformImageDto.transformations
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Generate image URL with specific options
   */
  @Post('generate-url')
  @UseGuards(JwtAuthGuard)
  async generateImageUrl(@Body() body: {
    publicId: string;
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }) {
    if (!body.publicId) {
      throw new BadRequestException('Public ID is required');
    }

    try {
      const imageUrl = this.cloudinaryService.generateImageUrl(body.publicId, {
        width: body.width,
        height: body.height,
        crop: body.crop,
        quality: body.quality,
        format: body.format
      });
      
      return {
        success: true,
        message: 'Image URL generated successfully',
        data: {
          public_id: body.publicId,
          image_url: imageUrl,
          options: {
            width: body.width,
            height: body.height,
            crop: body.crop,
            quality: body.quality,
            format: body.format
          }
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
