import { IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional, Min } from 'class-validator';
import { ScheduleStatus } from '../../../shared/schemas/schedule.entity';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  routeId: number;

  @IsNotEmpty()
  @IsNumber()
  busId: number;

  @IsNotEmpty()
  @IsDateString()
  departureTime: string;

  @IsNotEmpty()
  @IsDateString()
  arrivalTime: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  availableSeat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalSeats: number;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}

