import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class RemoveMultipleImagesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  publicIds: string[];
}

