import { IsOptional, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { SeatType, TicketStatus } from '../../../shared/schemas/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsNumber()
  schedule_id?: number;

  @IsOptional()
  @IsNumber()
  seat_id?: number;

  @IsOptional()
  @IsDateString()
  departure_time?: string;

  @IsOptional()
  @IsDateString()
  arrival_time?: string;

  @IsOptional()
  @IsEnum(SeatType)
  seat_type?: SeatType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}

