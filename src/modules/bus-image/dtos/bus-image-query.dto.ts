import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class BusImageQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  bus_id?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}




