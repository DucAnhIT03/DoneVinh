import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { SeatType } from '../../../shared/schemas/ticket.entity';

export class BookTicketDto {
  @IsNotEmpty()
  @IsNumber()
  schedule_id: number;

  @IsNotEmpty()
  @IsNumber()
  seat_id: number;

  @IsNotEmpty()
  @IsEnum(SeatType)
  seat_type: SeatType;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}

export class CancelTicketDto {
  @IsNotEmpty()
  @IsNumber()
  ticket_id: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
