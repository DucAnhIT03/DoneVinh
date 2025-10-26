import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ProviderType } from '../../../shared/schemas/payment-provider.entity';

export class CreatePaymentProviderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  provider_name: string;

  @IsNotEmpty()
  @IsEnum(ProviderType)
  provider_type: ProviderType;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  api_endpoint?: string;
}




