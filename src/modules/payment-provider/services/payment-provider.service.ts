import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentProviderRepository } from '../repositories/payment-provider.repository';
import { CreatePaymentProviderDto } from '../dtos/create-payment-provider.dto';
import { UpdatePaymentProviderDto } from '../dtos/update-payment-provider.dto';
import { PaymentProviderQueryDto } from '../dtos/payment-provider-query.dto';
import { PaymentProviderResponseDto, PaymentProviderWithDetailsResponseDto } from '../dtos/payment-provider-response.dto';
import { PaymentProvider, ProviderType } from '../../../shared/schemas/payment-provider.entity';

@Injectable()
export class PaymentProviderService {
  constructor(private readonly paymentProviderRepository: PaymentProviderRepository) {}

  async findAll(queryDto: PaymentProviderQueryDto): Promise<{
    paymentProviders: PaymentProviderResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { paymentProviders, total } = await this.paymentProviderRepository.findAll(queryDto);
    
    const totalPages = Math.ceil(total / queryDto.limit);
    
    return {
      paymentProviders: paymentProviders.map(provider => this.mapToResponseDto(provider)),
      total,
      page: queryDto.page,
      limit: queryDto.limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<PaymentProviderWithDetailsResponseDto> {
    const paymentProvider = await this.paymentProviderRepository.findByIdWithDetails(id);
    if (!paymentProvider) {
      throw new NotFoundException(`Payment provider with ID ${id} not found`);
    }
    return this.mapToDetailsResponseDto(paymentProvider);
  }

  async create(createPaymentProviderDto: CreatePaymentProviderDto): Promise<PaymentProviderResponseDto> {
    // Validate provider name uniqueness
    const existingProvider = await this.paymentProviderRepository['paymentProviderRepository'].findOne({
      where: { provider_name: createPaymentProviderDto.provider_name }
    });
    
    if (existingProvider) {
      throw new BadRequestException('Payment provider with this name already exists');
    }

    // Validate API endpoint if provided
    if (createPaymentProviderDto.api_endpoint) {
      try {
        new URL(createPaymentProviderDto.api_endpoint);
      } catch {
        throw new BadRequestException('Invalid API endpoint URL');
      }
    }

    const paymentProvider = await this.paymentProviderRepository.create(createPaymentProviderDto);
    return this.mapToResponseDto(paymentProvider);
  }

  async update(id: number, updatePaymentProviderDto: UpdatePaymentProviderDto): Promise<PaymentProviderResponseDto> {
    const existingProvider = await this.paymentProviderRepository.findById(id);
    if (!existingProvider) {
      throw new NotFoundException(`Payment provider with ID ${id} not found`);
    }

    // Validate provider name uniqueness if provided
    if (updatePaymentProviderDto.provider_name) {
      const existingProviderWithName = await this.paymentProviderRepository['paymentProviderRepository'].findOne({
        where: { provider_name: updatePaymentProviderDto.provider_name }
      });
      
      if (existingProviderWithName && existingProviderWithName.id !== id) {
        throw new BadRequestException('Payment provider with this name already exists');
      }
    }

    // Validate API endpoint if provided
    if (updatePaymentProviderDto.api_endpoint) {
      try {
        new URL(updatePaymentProviderDto.api_endpoint);
      } catch {
        throw new BadRequestException('Invalid API endpoint URL');
      }
    }

    const paymentProvider = await this.paymentProviderRepository.update(id, updatePaymentProviderDto);
    if (!paymentProvider) {
      throw new NotFoundException(`Payment provider with ID ${id} not found`);
    }
    return this.mapToResponseDto(paymentProvider);
  }

  async delete(id: number): Promise<void> {
    const paymentProvider = await this.paymentProviderRepository.findById(id);
    if (!paymentProvider) {
      throw new NotFoundException(`Payment provider with ID ${id} not found`);
    }

    // Check if provider has active payments
    const providerWithPayments = await this.paymentProviderRepository.findByIdWithDetails(id);
    if (providerWithPayments?.payments && providerWithPayments.payments.length > 0) {
      throw new BadRequestException('Cannot delete payment provider with existing payments');
    }

    await this.paymentProviderRepository.delete(id);
  }

  async findByType(providerType: ProviderType): Promise<PaymentProviderWithDetailsResponseDto[]> {
    const providers = await this.paymentProviderRepository.findByType(providerType);
    return providers.map(provider => this.mapToDetailsResponseDto(provider));
  }

  async getActiveProviders(): Promise<PaymentProviderWithDetailsResponseDto[]> {
    const providers = await this.paymentProviderRepository.findActiveProviders();
    return providers.map(provider => this.mapToDetailsResponseDto(provider));
  }

  async getProviderStatistics(id: number): Promise<{
    totalPayments: number;
    totalAmount: number;
    successRate: number;
    lastPaymentDate?: Date;
  }> {
    const provider = await this.paymentProviderRepository.findById(id);
    if (!provider) {
      throw new NotFoundException(`Payment provider with ID ${id} not found`);
    }

    return await this.paymentProviderRepository.getProviderStatistics(id);
  }

  async getProvidersByRevenue(limit: number = 10): Promise<PaymentProviderWithDetailsResponseDto[]> {
    const providers = await this.paymentProviderRepository.getProvidersByRevenue(limit);
    return providers.map(provider => this.mapToDetailsResponseDto(provider));
  }

  async getProviderTypesStatistics(): Promise<{
    [key in ProviderType]: {
      count: number;
      totalPayments: number;
      totalAmount: number;
    };
  }> {
    const result = await this.paymentProviderRepository['paymentProviderRepository']
      .createQueryBuilder('provider')
      .leftJoin('provider.payments', 'payment')
      .select([
        'provider.provider_type',
        'COUNT(DISTINCT provider.id) as count',
        'COUNT(payment.id) as totalPayments',
        'SUM(payment.amount) as totalAmount'
      ])
      .groupBy('provider.provider_type')
      .getRawMany();

    const statistics = {} as any;
    
    // Initialize all provider types
    Object.values(ProviderType).forEach(type => {
      statistics[type] = {
        count: 0,
        totalPayments: 0,
        totalAmount: 0,
      };
    });

    // Fill with actual data
    result.forEach(row => {
      statistics[row.provider_type] = {
        count: parseInt(row.count),
        totalPayments: parseInt(row.totalPayments),
        totalAmount: parseFloat(row.totalAmount) || 0,
      };
    });

    return statistics;
  }

  private mapToResponseDto(paymentProvider: PaymentProvider): PaymentProviderResponseDto {
    return {
      id: paymentProvider.id,
      provider_name: paymentProvider.provider_name,
      provider_type: paymentProvider.provider_type,
      api_endpoint: paymentProvider.api_endpoint,
      created_at: paymentProvider.created_at,
      updated_at: paymentProvider.updated_at,
    };
  }

  private mapToDetailsResponseDto(paymentProvider: PaymentProvider): PaymentProviderWithDetailsResponseDto {
    const baseDto = this.mapToResponseDto(paymentProvider);
    
    return {
      ...baseDto,
      payments: paymentProvider.payments?.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status.toString(),
        payment_method: payment.payment_method.toString(),
        created_at: payment.created_at,
        user: payment.user ? {
          id: payment.user.id,
          first_name: payment.user.first_name,
          last_name: payment.user.last_name,
          email: payment.user.email,
        } : {
          id: 0,
          first_name: '',
          last_name: '',
          email: '',
        },
      })) || [],
    };
  }
}
