import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class TransformImageDto {
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @IsOptional()
  @IsObject()
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    gravity?: string;
    radius?: number;
    effect?: string;
    opacity?: number;
    overlay?: string;
    underlay?: string;
    color?: string;
    background?: string;
    angle?: number;
    flags?: string;
    zoom?: number;
    x?: number;
    y?: number;
    aspect_ratio?: string;
    dpr?: number;
    fetch_format?: string;
    [key: string]: any;
  };
}
