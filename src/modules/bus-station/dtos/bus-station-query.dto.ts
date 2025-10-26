import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BusStationQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  stationId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  busId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'arrivalTime';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}
