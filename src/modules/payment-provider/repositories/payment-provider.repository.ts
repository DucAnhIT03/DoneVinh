import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaymentProvider, ProviderType } from '../../../shared/schemas/payment-provider.entity';
import { PaymentProviderQueryDto } from '../dtos/payment-provider-query.dto';

@Injectable()
export class PaymentProviderRepository {
  constructor(
    @InjectRepository(PaymentProvider)
    private readonly paymentProviderRepository: Repository<PaymentProvider>,
  ) {}

  async findAll(queryDto: PaymentProviderQueryDto): Promise<{ paymentProviders: PaymentProvider[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);
    
    const [paymentProviders, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return { paymentProviders, total };
  }

  async findById(id: number): Promise<PaymentProvider | null> {
    return this.paymentProviderRepository.findOne({
      where: { id },
      relations: ['payments'],
    });
  }

  async findByIdWithDetails(id: number): Promise<PaymentProvider | null> {
    return this.paymentProviderRepository.findOne({
      where: { id },
      relations: ['payments', 'payments.user'],
    });
  }

  async create(paymentProviderData: Partial<PaymentProvider>): Promise<PaymentProvider> {
    const paymentProvider = this.paymentProviderRepository.create(paymentProviderData);
    return this.paymentProviderRepository.save(paymentProvider);
  }

  async update(id: number, paymentProviderData: Partial<PaymentProvider>): Promise<PaymentProvider | null> {
    await this.paymentProviderRepository.update(id, paymentProviderData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.paymentProviderRepository.delete(id);
  }

  async findByType(providerType: ProviderType): Promise<PaymentProvider[]> {
    return this.paymentProviderRepository.find({
      where: { provider_type: providerType },
      relations: ['payments'],
    });
  }

  async findActiveProviders(): Promise<PaymentProvider[]> {
    return this.paymentProviderRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.payments', 'payments')
      .where('payments.id IS NOT NULL')
      .groupBy('provider.id')
      .orderBy('provider.provider_name', 'ASC')
      .getMany();
  }

  async getProviderStatistics(id: number): Promise<{
    totalPayments: number;
    totalAmount: number;
    successRate: number;
    lastPaymentDate?: Date;
  }> {
    const result = await this.paymentProviderRepository
      .createQueryBuilder('provider')
      .leftJoin('provider.payments', 'payment')
      .select([
        'provider.id',
        'COUNT(payment.id) as totalPayments',
        'SUM(payment.amount) as totalAmount',
        'AVG(CASE WHEN payment.status = "COMPLETED" THEN 1 ELSE 0 END) as successRate',
        'MAX(payment.created_at) as lastPaymentDate'
      ])
      .where('provider.id = :id', { id })
      .groupBy('provider.id')
      .getRawOne();

    return {
      totalPayments: parseInt(result?.totalPayments) || 0,
      totalAmount: parseFloat(result?.totalAmount) || 0,
      successRate: parseFloat(result?.successRate) * 100 || 0,
      lastPaymentDate: result?.lastPaymentDate ? new Date(result.lastPaymentDate) : undefined,
    };
  }

  async getProvidersByRevenue(limit: number = 10): Promise<PaymentProvider[]> {
    return this.paymentProviderRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.payments', 'payments')
      .leftJoinAndSelect('payments.user', 'user')
      .select([
        'provider.id',
        'provider.provider_name',
        'provider.provider_type',
        'provider.api_endpoint',
        'provider.created_at',
        'provider.updated_at'
      ])
      .addSelect('SUM(payments.amount)', 'totalRevenue')
      .groupBy('provider.id')
      .orderBy('totalRevenue', 'DESC')
      .limit(limit)
      .getMany();
  }

  private createQueryBuilder(queryDto: PaymentProviderQueryDto): SelectQueryBuilder<PaymentProvider> {
    const queryBuilder = this.paymentProviderRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.payments', 'payments');

    // Apply filters
    if (queryDto.provider_type) {
      queryBuilder.andWhere('provider.provider_type = :providerType', { 
        providerType: queryDto.provider_type 
      });
    }

    if (queryDto.minAmount !== undefined) {
      queryBuilder.andWhere('payments.amount >= :minAmount', { minAmount: queryDto.minAmount });
    }

    if (queryDto.maxAmount !== undefined) {
      queryBuilder.andWhere('payments.amount <= :maxAmount', { maxAmount: queryDto.maxAmount });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(provider.provider_name LIKE :search OR provider.api_endpoint LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'id';
    const sortOrder = queryDto.sortOrder || 'ASC';
    queryBuilder.orderBy(`provider.${sortBy}`, sortOrder);

    return queryBuilder;
  }
}




