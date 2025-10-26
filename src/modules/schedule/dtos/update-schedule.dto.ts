import { IsOptional, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { ScheduleStatus } from '../../../shared/schemas/schedule.entity';

export class UpdateScheduleDto {
  @IsOptional()
  @IsNumber()
  routeId?: number;

  @IsOptional()
  @IsNumber()
  busId?: number;

  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @IsOptional()
  @IsDateString()
  arrivalTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  availableSeat?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalSeats?: number;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}

