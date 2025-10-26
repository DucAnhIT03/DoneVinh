import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BusQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

