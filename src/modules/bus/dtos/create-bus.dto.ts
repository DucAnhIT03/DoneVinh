import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateBusDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  descriptions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  license_plate?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  capacity: number;

  @IsNotEmpty()
  @IsNumber()
  company_id: number;
}

