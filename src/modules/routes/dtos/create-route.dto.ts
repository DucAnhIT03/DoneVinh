import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  departure_station_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  arrival_station_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  distance: number;
}




