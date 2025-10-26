import { IsOptional, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TicketStatus } from '../../../shared/schemas/ticket.entity';

export class TicketQueryDto {
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
  schedule_id?: number;

  @IsOptional()
  @IsNumber()
  seat_id?: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

