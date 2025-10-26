import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('Cloudinary configured successfully');
  }

  /**
   * Upload single image to Cloudinary
   */
  async uploadSingleImage(file: Express.Multer.File, folder?: string): Promise<any> {
    try {
      this.logger.log(`Uploading single image: ${file.originalname}`);

      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder || 'bus-booking',
        resource_type: 'auto',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      this.logger.log(`Image uploaded successfully: ${result.public_id}`);
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at
      };
    } catch (error) {
      this.logger.error(`Failed to upload image: ${error.message}`);
      throw new BadRequestException('Failed to upload image');
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<any[]> {
    try {
      this.logger.log(`Uploading ${files.length} images`);

      const uploadPromises = files.map(file => this.uploadSingleImage(file, folder));
      const results = await Promise.all(uploadPromises);

      this.logger.log(`Successfully uploaded ${results.length} images`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to upload multiple images: ${error.message}`);
      throw new BadRequestException('Failed to upload images');
    }
  }

  /**
   * Remove image from Cloudinary
   */
  async removeImage(publicId: string): Promise<any> {
    try {
      this.logger.log(`Removing image: ${publicId}`);

      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        this.logger.log(`Image removed successfully: ${publicId}`);
        return {
          success: true,
          message: 'Image removed successfully',
          public_id: publicId
        };
      } else {
        this.logger.warn(`Failed to remove image: ${publicId}`);
        return {
          success: false,
          message: 'Failed to remove image',
          public_id: publicId
        };
      }
    } catch (error) {
      this.logger.error(`Error removing image: ${error.message}`);
      throw new BadRequestException('Failed to remove image');
    }
  }

  /**
   * Remove multiple images from Cloudinary
   */
  async removeMultipleImages(publicIds: string[]): Promise<any[]> {
    try {
      this.logger.log(`Removing ${publicIds.length} images`);

      const removePromises = publicIds.map(publicId => this.removeImage(publicId));
      const results = await Promise.all(removePromises);

      this.logger.log(`Removal process completed for ${results.length} images`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to remove multiple images: ${error.message}`);
      throw new BadRequestException('Failed to remove images');
    }
  }

  /**
   * Get image information from Cloudinary
   */
  async getImageInfo(publicId: string): Promise<any> {
    try {
      this.logger.log(`Getting image info: ${publicId}`);

      const result = await cloudinary.api.resource(publicId);
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
        tags: result.tags || []
      };
    } catch (error) {
      this.logger.error(`Failed to get image info: ${error.message}`);
      throw new BadRequestException('Image not found');
    }
  }

  /**
   * Transform image URL with Cloudinary transformations
   */
  transformImageUrl(publicId: string, transformations: any = {}): string {
    try {
      const defaultTransformations = {
        quality: 'auto',
        fetch_format: 'auto'
      };

      const finalTransformations = { ...defaultTransformations, ...transformations };
      
      return cloudinary.url(publicId, finalTransformations);
    } catch (error) {
      this.logger.error(`Failed to transform image URL: ${error.message}`);
      throw new BadRequestException('Failed to transform image URL');
    }
  }

  /**
   * Generate image URL with specific transformations
   */
  generateImageUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}): string {
    try {
      const transformations = {
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto',
        fetch_format: options.format || 'auto'
      };

      return cloudinary.url(publicId, transformations);
    } catch (error) {
      this.logger.error(`Failed to generate image URL: ${error.message}`);
      throw new BadRequestException('Failed to generate image URL');
    }
  }
}

