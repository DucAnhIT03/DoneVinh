import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Bus } from '../../../shared/schemas/bus.entity';
import { BusQueryDto } from '../dtos/bus-query.dto';

@Injectable()
export class BusRepository {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async findAll(queryDto: BusQueryDto): Promise<{ buses: Bus[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);
    
    const [buses, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return { buses, total };
  }

  async findById(id: number): Promise<Bus | null> {
    return this.busRepository.findOne({
      where: { id },
      relations: ['company', 'busImages', 'seats', 'schedules', 'busReviews'],
    });
  }

  async findByIdWithDetails(id: number): Promise<Bus | null> {
    return this.busRepository.findOne({
      where: { id },
      relations: [
        'company',
        'busImages',
        'seats',
        'schedules',
        'busReviews',
        'busReviews.user',
      ],
    });
  }

  async create(busData: Partial<Bus>): Promise<Bus> {
    const bus = this.busRepository.create(busData);
    return this.busRepository.save(bus);
  }

  async update(id: number, busData: Partial<Bus>): Promise<Bus | null> {
    await this.busRepository.update(id, busData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.busRepository.delete(id);
  }

  async findByCompany(companyId: number): Promise<Bus[]> {
    return this.busRepository.find({
      where: { company_id: companyId },
      relations: ['company', 'busImages'],
    });
  }

  async findAvailableBuses(): Promise<Bus[]> {
    return this.busRepository
      .createQueryBuilder('bus')
      .leftJoinAndSelect('bus.company', 'company')
      .leftJoinAndSelect('bus.busImages', 'busImages')
      .where('bus.capacity > 0')
      .orderBy('bus.name', 'ASC')
      .getMany();
  }

  async findBusesWithSchedules(): Promise<Bus[]> {
    return this.busRepository
      .createQueryBuilder('bus')
      .leftJoinAndSelect('bus.company', 'company')
      .leftJoinAndSelect('bus.schedules', 'schedules')
      .leftJoinAndSelect('schedules.route', 'route')
      .where('schedules.id IS NOT NULL')
      .orderBy('bus.name', 'ASC')
      .getMany();
  }

  private createQueryBuilder(queryDto: BusQueryDto): SelectQueryBuilder<Bus> {
    const queryBuilder = this.busRepository
      .createQueryBuilder('bus')
      .leftJoinAndSelect('bus.company', 'company')
      .leftJoinAndSelect('bus.busImages', 'busImages');

    // Apply filters
    if (queryDto.company_id) {
      queryBuilder.andWhere('bus.company_id = :companyId', { companyId: queryDto.company_id });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(bus.name LIKE :search OR bus.license_plate LIKE :search OR company.company_name LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'name';
    const sortOrder = queryDto.sortOrder || 'ASC';
    queryBuilder.orderBy(`bus.${sortBy}`, sortOrder);

    return queryBuilder;
  }
}

