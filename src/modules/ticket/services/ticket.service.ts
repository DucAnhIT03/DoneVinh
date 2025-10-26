import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TicketRepository } from '../repositories/ticket.repository';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';
import { TicketQueryDto } from '../dtos/ticket-query.dto';
import { BookTicketDto, CancelTicketDto } from '../dtos/book-ticket.dto';
import { TicketResponseDto, TicketWithDetailsResponseDto } from '../dtos/ticket-response.dto';
import { Ticket, TicketStatus, SeatType } from '../../../shared/schemas/ticket.entity';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async findAll(queryDto: TicketQueryDto): Promise<{
    tickets: TicketResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { tickets, total } = await this.ticketRepository.findAll(queryDto);
    
    const totalPages = Math.ceil(total / queryDto.limit);
    
    return {
      tickets: tickets.map(ticket => this.mapToResponseDto(ticket)),
      total,
      page: queryDto.page,
      limit: queryDto.limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<TicketWithDetailsResponseDto> {
    const ticket = await this.ticketRepository.findByIdWithDetails(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return this.mapToDetailsResponseDto(ticket);
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    // Validate departure and arrival times
    const departureTime = new Date(createTicketDto.departure_time);
    const arrivalTime = new Date(createTicketDto.arrival_time);
    
    if (departureTime >= arrivalTime) {
      throw new BadRequestException('Departure time must be before arrival time');
    }

    // Validate price
    if (createTicketDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    const ticketData = {
      ...createTicketDto,
      departure_time: departureTime,
      arrival_time: arrivalTime,
    };

    const ticket = await this.ticketRepository.create(ticketData);
    return this.mapToResponseDto(ticket);
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
    const existingTicket = await this.ticketRepository.findById(id);
    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    // Validate departure and arrival times if provided
    if (updateTicketDto.departure_time && updateTicketDto.arrival_time) {
      const departureTime = new Date(updateTicketDto.departure_time);
      const arrivalTime = new Date(updateTicketDto.arrival_time);
      
      if (departureTime >= arrivalTime) {
        throw new BadRequestException('Departure time must be before arrival time');
      }
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...updateTicketDto };
    if (updateTicketDto.departure_time) {
      updateData.departure_time = new Date(updateTicketDto.departure_time);
    }
    if (updateTicketDto.arrival_time) {
      updateData.arrival_time = new Date(updateTicketDto.arrival_time);
    }

    const ticket = await this.ticketRepository.update(id, updateData);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return this.mapToResponseDto(ticket);
  }

  async delete(id: number): Promise<void> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    await this.ticketRepository.delete(id);
  }

  async bookTicket(bookTicketDto: BookTicketDto): Promise<TicketResponseDto> {
    // Check if seat is available
    const existingTicket = await this.ticketRepository['ticketRepository'].findOne({
      where: {
        schedule_id: bookTicketDto.schedule_id,
        seat_id: bookTicketDto.seat_id,
        status: TicketStatus.BOOKED
      }
    });

    if (existingTicket) {
      throw new BadRequestException('Seat is already booked');
    }

    // Get schedule details to calculate price
    const schedule = await this.ticketRepository['ticketRepository']
      .createQueryBuilder('ticket')
      .leftJoin('ticket.schedule', 'schedule')
      .leftJoin('schedule.route', 'route')
      .where('schedule.id = :scheduleId', { scheduleId: bookTicketDto.schedule_id })
      .getOne();

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Calculate price based on seat type
    const basePrice = 100000; // Base price, should come from route
    const seatTypeMultiplier = this.getSeatTypeMultiplier(bookTicketDto.seat_type);
    const totalPrice = basePrice * seatTypeMultiplier;

    const ticketData = {
      schedule_id: bookTicketDto.schedule_id,
      seat_id: bookTicketDto.seat_id,
      departure_time: new Date(), // Should come from schedule
      arrival_time: new Date(), // Should come from schedule
      seat_type: bookTicketDto.seat_type,
      price: totalPrice,
      status: TicketStatus.BOOKED,
    };

    const ticket = await this.ticketRepository.create(ticketData);
    return this.mapToResponseDto(ticket);
  }

  async cancelTicket(cancelTicketDto: CancelTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(cancelTicketDto.ticket_id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${cancelTicketDto.ticket_id} not found`);
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Ticket is already cancelled');
    }

    const updatedTicket = await this.ticketRepository.update(cancelTicketDto.ticket_id, {
      status: TicketStatus.CANCELLED
    });

    if (!updatedTicket) {
      throw new NotFoundException(`Ticket with ID ${cancelTicketDto.ticket_id} not found`);
    }

    return this.mapToResponseDto(updatedTicket);
  }

  async findBySchedule(scheduleId: number): Promise<TicketWithDetailsResponseDto[]> {
    const tickets = await this.ticketRepository.findBySchedule(scheduleId);
    return tickets.map(ticket => this.mapToDetailsResponseDto(ticket));
  }

  async findBySeat(seatId: number): Promise<TicketWithDetailsResponseDto[]> {
    const tickets = await this.ticketRepository.findBySeat(seatId);
    return tickets.map(ticket => this.mapToDetailsResponseDto(ticket));
  }

  async getTicketStatistics(): Promise<{
    totalTickets: number;
    bookedTickets: number;
    cancelledTickets: number;
    totalRevenue: number;
  }> {
    return this.ticketRepository.getTicketStatistics();
  }

  async findTicketsByDateRange(startDate: string, endDate: string): Promise<TicketWithDetailsResponseDto[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tickets = await this.ticketRepository.findTicketsByDateRange(start, end);
    return tickets.map(ticket => this.mapToDetailsResponseDto(ticket));
  }

  private getSeatTypeMultiplier(seatType: SeatType): number {
    switch (seatType) {
      case SeatType.LUXURY:
        return 2.0;
      case SeatType.VIP:
        return 1.5;
      case SeatType.STANDARD:
        return 1.0;
      default:
        return 1.0;
    }
  }

  private mapToResponseDto(ticket: Ticket): TicketResponseDto {
    return {
      id: ticket.id,
      schedule_id: ticket.schedule_id,
      seat_id: ticket.seat_id,
      departure_time: ticket.departure_time,
      arrival_time: ticket.arrival_time,
      seat_type: ticket.seat_type,
      price: ticket.price,
      status: ticket.status,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
    };
  }

  private mapToDetailsResponseDto(ticket: Ticket): TicketWithDetailsResponseDto {
    const baseDto = this.mapToResponseDto(ticket);
    
    return {
      ...baseDto,
      schedule: ticket.schedule ? {
        id: ticket.schedule.id,
        departure_time: ticket.schedule.departureTime,
        arrival_time: ticket.schedule.arrivalTime,
        available_seat: ticket.schedule.availableSeat,
        total_seats: ticket.schedule.totalSeats,
        status: ticket.schedule.status,
        route: ticket.schedule.route ? {
          id: ticket.schedule.route.id,
          price: ticket.schedule.route.price,
          duration: ticket.schedule.route.duration,
          distance: ticket.schedule.route.distance,
          departureStation: {
            id: ticket.schedule.route.departureStation?.id || 0,
            name: ticket.schedule.route.departureStation?.name || '',
            location: ticket.schedule.route.departureStation?.location || '',
          },
          arrivalStation: {
            id: ticket.schedule.route.arrivalStation?.id || 0,
            name: ticket.schedule.route.arrivalStation?.name || '',
            location: ticket.schedule.route.arrivalStation?.location || '',
          },
        } : {
          id: 0,
          price: 0,
          duration: 0,
          distance: 0,
          departureStation: { id: 0, name: '', location: '' },
          arrivalStation: { id: 0, name: '', location: '' },
        },
        bus: ticket.schedule.bus ? {
          id: ticket.schedule.bus.id,
          name: ticket.schedule.bus.name,
          license_plate: ticket.schedule.bus.license_plate,
          capacity: ticket.schedule.bus.capacity,
          company: {
            id: ticket.schedule.bus.company?.id || 0,
            company_name: ticket.schedule.bus.company?.company_name || '',
          },
        } : {
          id: 0,
          name: '',
          license_plate: '',
          capacity: 0,
          company: { id: 0, company_name: '' },
        },
      } : undefined,
      seat: ticket.seat ? {
        id: ticket.seat.id,
        seat_number: ticket.seat.seat_number,
        seat_type: ticket.seat.seat_type,
        status: ticket.seat.status,
        price_for_seat_type: ticket.seat.price_for_seat_type,
      } : undefined,
      payments: ticket.payments?.map(payment => ({
        id: payment.id,
        payment_method: payment.payment_method,
        amount: payment.amount,
        status: payment.status,
        created_at: payment.created_at,
      })) || [],
    };
  }
}
