import { IsNotEmpty, IsString, IsNumber, IsUrl, MaxLength } from 'class-validator';

export class CreateBusImageDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  image_url: string;

  @IsNotEmpty()
  @IsNumber()
  bus_id: number;
}




