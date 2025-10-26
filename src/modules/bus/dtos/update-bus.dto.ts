import { IsOptional, IsString, IsNumber, Min, MaxLength } from 'class-validator';

export class UpdateBusDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  descriptions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  license_plate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsNumber()
  company_id?: number;
}

