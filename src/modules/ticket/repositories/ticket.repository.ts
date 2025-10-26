import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Ticket, TicketStatus } from '../../../shared/schemas/ticket.entity';
import { TicketQueryDto } from '../dtos/ticket-query.dto';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async findAll(queryDto: TicketQueryDto): Promise<{ tickets: Ticket[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);
    
    const [tickets, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return { tickets, total };
  }

  async findById(id: number): Promise<Ticket | null> {
    return this.ticketRepository.findOne({
      where: { id },
      relations: ['schedule', 'seat', 'payments'],
    });
  }

  async findByIdWithDetails(id: number): Promise<Ticket | null> {
    return this.ticketRepository.findOne({
      where: { id },
      relations: [
        'schedule',
        'schedule.route',
        'schedule.route.departureStation',
        'schedule.route.arrivalStation',
        'schedule.bus',
        'schedule.bus.company',
        'seat',
        'payments',
      ],
    });
  }

  async create(ticketData: Partial<Ticket>): Promise<Ticket> {
    const ticket = this.ticketRepository.create(ticketData);
    return this.ticketRepository.save(ticket);
  }

  async update(id: number, ticketData: Partial<Ticket>): Promise<Ticket | null> {
    await this.ticketRepository.update(id, ticketData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.ticketRepository.delete(id);
  }

  async findBySchedule(scheduleId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { schedule_id: scheduleId },
      relations: ['seat', 'payments'],
    });
  }

  async findBySeat(seatId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { seat_id: seatId },
      relations: ['schedule', 'payments'],
    });
  }

  async findBookedTicketsBySchedule(scheduleId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { 
        schedule_id: scheduleId,
        status: TicketStatus.BOOKED 
      },
      relations: ['seat'],
    });
  }

  async findTicketsByDateRange(startDate: Date, endDate: Date): Promise<Ticket[]> {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.schedule', 'schedule')
      .leftJoinAndSelect('ticket.seat', 'seat')
      .leftJoinAndSelect('ticket.payments', 'payments')
      .where('ticket.departure_time >= :startDate', { startDate })
      .andWhere('ticket.departure_time <= :endDate', { endDate })
      .orderBy('ticket.departure_time', 'ASC')
      .getMany();
  }

  async findTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { status },
      relations: ['schedule', 'seat', 'payments'],
    });
  }

  async getTicketStatistics(): Promise<{
    totalTickets: number;
    bookedTickets: number;
    cancelledTickets: number;
    totalRevenue: number;
  }> {
    const totalTickets = await this.ticketRepository.count();
    const bookedTickets = await this.ticketRepository.count({ 
      where: { status: TicketStatus.BOOKED } 
    });
    const cancelledTickets = await this.ticketRepository.count({ 
      where: { status: TicketStatus.CANCELLED } 
    });

    const revenueResult = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('SUM(ticket.price)', 'totalRevenue')
      .where('ticket.status = :status', { status: TicketStatus.BOOKED })
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.totalRevenue || '0');

    return {
      totalTickets,
      bookedTickets,
      cancelledTickets,
      totalRevenue,
    };
  }

  private createQueryBuilder(queryDto: TicketQueryDto): SelectQueryBuilder<Ticket> {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.schedule', 'schedule')
      .leftJoinAndSelect('ticket.seat', 'seat')
      .leftJoinAndSelect('ticket.payments', 'payments');

    // Apply filters
    if (queryDto.schedule_id) {
      queryBuilder.andWhere('ticket.schedule_id = :scheduleId', { scheduleId: queryDto.schedule_id });
    }

    if (queryDto.seat_id) {
      queryBuilder.andWhere('ticket.seat_id = :seatId', { seatId: queryDto.seat_id });
    }

    if (queryDto.status) {
      queryBuilder.andWhere('ticket.status = :status', { status: queryDto.status });
    }

    if (queryDto.departureDate) {
      const startDate = new Date(queryDto.departureDate);
      const endDate = new Date(queryDto.departureDate);
      endDate.setDate(endDate.getDate() + 1);
      
      queryBuilder
        .andWhere('ticket.departure_time >= :startDate', { startDate })
        .andWhere('ticket.departure_time < :endDate', { endDate });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(seat.seat_number LIKE :search OR schedule.id LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'created_at';
    const sortOrder = queryDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`ticket.${sortBy}`, sortOrder);

    return queryBuilder;
  }
}

