import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateBusStationDto {
  @IsNumber()
  stationId: number;

  @IsNumber()
  busId: number;

  @IsDateString()
  arrivalTime: string;

  @IsDateString()
  departureTime: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  gate?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  availableSeats?: number;

  @IsOptional()
  @IsNumber()
  totalSeats?: number;
}
