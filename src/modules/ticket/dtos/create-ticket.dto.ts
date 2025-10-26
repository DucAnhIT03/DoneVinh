import { IsNotEmpty, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { SeatType } from '../../../shared/schemas/ticket.entity';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  schedule_id: number;

  @IsNotEmpty()
  @IsNumber()
  seat_id: number;

  @IsNotEmpty()
  @IsDateString()
  departure_time: string;

  @IsNotEmpty()
  @IsDateString()
  arrival_time: string;

  @IsNotEmpty()
  @IsEnum(SeatType)
  seat_type: SeatType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}

