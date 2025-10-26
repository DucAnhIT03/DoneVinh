import { ProviderType } from '../../../shared/schemas/payment-provider.entity';

export class PaymentProviderResponseDto {
  id: number;
  provider_name: string;
  provider_type: ProviderType;
  api_endpoint?: string;
  created_at: Date;
  updated_at: Date;
}

export class PaymentProviderWithDetailsResponseDto extends PaymentProviderResponseDto {
  statistics?: {
    totalPayments: number;
    totalAmount: number;
    successRate: number;
    lastPaymentDate?: Date;
  };
  payments?: {
    id: number;
    amount: number;
    status: string;
    payment_method: string;
    created_at: Date;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  }[];
}




