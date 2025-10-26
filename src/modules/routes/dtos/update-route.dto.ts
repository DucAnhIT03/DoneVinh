import { IsOptional, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateRouteDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  departure_station_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  arrival_station_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  distance?: number;
}




