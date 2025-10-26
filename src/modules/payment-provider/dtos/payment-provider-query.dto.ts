import { IsOptional, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProviderType } from '../../../shared/schemas/payment-provider.entity';

export class PaymentProviderQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsEnum(ProviderType)
  provider_type?: ProviderType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxAmount?: number;
}




