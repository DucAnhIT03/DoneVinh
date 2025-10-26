import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Schedule } from '../../../shared/schemas/schedule.entity';
import { ScheduleQueryDto } from '../dtos/schedule-query.dto';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(queryDto: ScheduleQueryDto): Promise<{ schedules: Schedule[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);
    
    const [schedules, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return { schedules, total };
  }

  async findById(id: number): Promise<Schedule | null> {
    return this.scheduleRepository.findOne({
      where: { id },
      relations: ['route', 'bus', 'bus.company'],
    });
  }

  async findByIdWithDetails(id: number): Promise<Schedule | null> {
    return this.scheduleRepository.findOne({
      where: { id },
      relations: [
        'route',
        'route.departureStation',
        'route.arrivalStation',
        'bus',
        'bus.company',
      ],
    });
  }

  async create(scheduleData: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(scheduleData);
    return this.scheduleRepository.save(schedule);
  }

  async update(id: number, scheduleData: Partial<Schedule>): Promise<Schedule | null> {
    await this.scheduleRepository.update(id, scheduleData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }

  async findByRouteAndDate(routeId: number, departureDate: string): Promise<Schedule[]> {
    const startDate = new Date(departureDate);
    const endDate = new Date(departureDate);
    endDate.setDate(endDate.getDate() + 1);

    return this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .leftJoinAndSelect('schedule.bus', 'bus')
      .leftJoinAndSelect('bus.company', 'company')
      .where('schedule.routeId = :routeId', { routeId })
      .andWhere('schedule.departureTime >= :startDate', { startDate })
      .andWhere('schedule.departureTime < :endDate', { endDate })
      .andWhere('schedule.status = :status', { status: 'AVAILABLE' })
      .orderBy('schedule.departureTime', 'ASC')
      .getMany();
  }

  async findByBusAndDate(busId: number, departureDate: string): Promise<Schedule[]> {
    const startDate = new Date(departureDate);
    const endDate = new Date(departureDate);
    endDate.setDate(endDate.getDate() + 1);

    return this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .leftJoinAndSelect('schedule.bus', 'bus')
      .where('schedule.busId = :busId', { busId })
      .andWhere('schedule.departureTime >= :startDate', { startDate })
      .andWhere('schedule.departureTime < :endDate', { endDate })
      .orderBy('schedule.departureTime', 'ASC')
      .getMany();
  }

  async updateAvailableSeats(id: number, seatsToBook: number): Promise<void> {
    await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({
        availableSeat: () => `available_seat - ${seatsToBook}`,
        status: () => `CASE WHEN (available_seat - ${seatsToBook}) <= 0 THEN 'FULL' ELSE status END`,
      })
      .where('id = :id', { id })
      .execute();
  }

  private createQueryBuilder(queryDto: ScheduleQueryDto): SelectQueryBuilder<Schedule> {
    const queryBuilder = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .leftJoinAndSelect('schedule.bus', 'bus')
      .leftJoinAndSelect('bus.company', 'company');

    // Apply filters
    if (queryDto.routeId) {
      queryBuilder.andWhere('schedule.routeId = :routeId', { routeId: queryDto.routeId });
    }

    if (queryDto.busId) {
      queryBuilder.andWhere('schedule.busId = :busId', { busId: queryDto.busId });
    }

    if (queryDto.departureDate) {
      const startDate = new Date(queryDto.departureDate);
      const endDate = new Date(queryDto.departureDate);
      endDate.setDate(endDate.getDate() + 1);
      
      queryBuilder
        .andWhere('schedule.departureTime >= :startDate', { startDate })
        .andWhere('schedule.departureTime < :endDate', { endDate });
    }

    if (queryDto.status) {
      queryBuilder.andWhere('schedule.status = :status', { status: queryDto.status });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(bus.name LIKE :search OR company.companyName LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'departureTime';
    const sortOrder = queryDto.sortOrder || 'ASC';
    queryBuilder.orderBy(`schedule.${sortBy}`, sortOrder);

    return queryBuilder;
  }
}
