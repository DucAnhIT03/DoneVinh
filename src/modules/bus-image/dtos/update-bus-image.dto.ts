import { IsOptional, IsString, IsUrl, MaxLength, IsNumber } from 'class-validator';

export class UpdateBusImageDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  image_url?: string;

  @IsOptional()
  @IsNumber()
  bus_id?: number;
}
