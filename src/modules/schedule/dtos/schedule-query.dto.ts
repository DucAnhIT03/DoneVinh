import { IsOptional, IsNumber, IsDateString, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ScheduleStatus } from '../../../shared/schemas/schedule.entity';

export class ScheduleQueryDto {
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
  routeId?: number;

  @IsOptional()
  @IsNumber()
  busId?: number;

  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsOptional()
  @IsString()
  sortBy?: string = 'departureTime';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
