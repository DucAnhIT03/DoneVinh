import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusCompanyDto {
  @ApiProperty({ 
    description: 'Bus company name',
    example: 'Phương Trang',
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Company name is required' })
  @IsString({ message: 'Company name must be a string' })
  company_name: string;

  @ApiProperty({ 
    description: 'Company image URL',
    example: 'https://example.com/company-logo.jpg',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;

  @ApiProperty({ 
    description: 'Company description',
    example: 'Leading bus company in Vietnam',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Descriptions must be a string' })
  descriptions?: string;
}

export class UpdateBusCompanyDto {
  @ApiProperty({ 
    description: 'Bus company name',
    example: 'Phương Trang',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'Company name must be a string' })
  company_name?: string;

  @ApiProperty({ 
    description: 'Company image URL',
    example: 'https://example.com/company-logo.jpg',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;

  @ApiProperty({ 
    description: 'Company description',
    example: 'Leading bus company in Vietnam',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Descriptions must be a string' })
  descriptions?: string;
}

export class BusCompanyResponseDto {
  @ApiProperty({ description: 'Company ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Company name', example: 'Phương Trang' })
  company_name: string;

  @ApiProperty({ description: 'Company image URL', example: 'https://example.com/company-logo.jpg', required: false })
  image?: string;

  @ApiProperty({ description: 'Company description', example: 'Leading bus company in Vietnam', required: false })
  descriptions?: string;

  @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class BusCompanyQueryDto {
  @ApiProperty({ 
    description: 'Search term for company name',
    example: 'Phương Trang',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ 
    description: 'Items per page',
    example: 10,
    required: false,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number = 10;

  @ApiProperty({ 
    description: 'Sort field',
    example: 'created_at',
    required: false
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @ApiProperty({ 
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    required: false
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
