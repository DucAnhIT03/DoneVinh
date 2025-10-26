import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentProviderService } from './services/payment-provider.service';
import { PaymentProviderController } from './controllers/payment-provider.controller';
import { PaymentProviderRepository } from './repositories/payment-provider.repository';
import { PaymentProvider } from '../../shared/schemas/payment-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentProvider])],
  controllers: [PaymentProviderController],
  providers: [PaymentProviderService, PaymentProviderRepository],
  exports: [PaymentProviderService, PaymentProviderRepository],
})
export class PaymentProviderModule {}




