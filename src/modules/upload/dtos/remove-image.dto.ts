import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveImageDto {
  @IsString()
  @IsNotEmpty()
  publicId: string;
}

