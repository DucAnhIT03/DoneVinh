import { IsOptional, IsString, IsEnum, IsUrl, MaxLength } from 'class-validator';
import { ProviderType } from '../../../shared/schemas/payment-provider.entity';

export class UpdatePaymentProviderDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  provider_name?: string;

  @IsOptional()
  @IsEnum(ProviderType)
  provider_type?: ProviderType;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  api_endpoint?: string;
}




