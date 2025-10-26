import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';
import { ScheduleQueryDto } from '../dtos/schedule-query.dto';
import { ScheduleResponseDto, ScheduleWithDetailsResponseDto } from '../dtos/schedule-response.dto';
import { Schedule, ScheduleStatus } from '../../../shared/schemas/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async findAll(queryDto: ScheduleQueryDto): Promise<{
    schedules: ScheduleResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { schedules, total } = await this.scheduleRepository.findAll(queryDto);
    
    const totalPages = Math.ceil(total / queryDto.limit);
    
    return {
      schedules: schedules.map(schedule => this.mapToResponseDto(schedule)),
      total,
      page: queryDto.page,
      limit: queryDto.limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<ScheduleWithDetailsResponseDto> {
    const schedule = await this.scheduleRepository.findByIdWithDetails(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return this.mapToDetailsResponseDto(schedule);
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<ScheduleResponseDto> {
    // Validate departure and arrival times
    const departureTime = new Date(createScheduleDto.departureTime);
    const arrivalTime = new Date(createScheduleDto.arrivalTime);
    
    if (departureTime >= arrivalTime) {
      throw new BadRequestException('Departure time must be before arrival time');
    }

    // Validate available seats
    if (createScheduleDto.availableSeat > createScheduleDto.totalSeats) {
      throw new BadRequestException('Available seats cannot exceed total seats');
    }

    // Set status based on available seats
    const status = createScheduleDto.availableSeat === 0 
      ? ScheduleStatus.FULL 
      : createScheduleDto.status || ScheduleStatus.AVAILABLE;

    const scheduleData = {
      ...createScheduleDto,
      departureTime: new Date(createScheduleDto.departureTime),
      arrivalTime: new Date(createScheduleDto.arrivalTime),
      status,
    };

    const schedule = await this.scheduleRepository.create(scheduleData);
    return this.mapToResponseDto(schedule);
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleResponseDto> {
    const existingSchedule = await this.scheduleRepository.findById(id);
    if (!existingSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    // Validate departure and arrival times if provided
    if (updateScheduleDto.departureTime && updateScheduleDto.arrivalTime) {
      const departureTime = new Date(updateScheduleDto.departureTime);
      const arrivalTime = new Date(updateScheduleDto.arrivalTime);
      
      if (departureTime >= arrivalTime) {
        throw new BadRequestException('Departure time must be before arrival time');
      }
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...updateScheduleDto };
    if (updateScheduleDto.departureTime) {
      updateData.departureTime = new Date(updateScheduleDto.departureTime);
    }
    if (updateScheduleDto.arrivalTime) {
      updateData.arrivalTime = new Date(updateScheduleDto.arrivalTime);
    }

    // Validate available seats if provided
    if (updateScheduleDto.availableSeat !== undefined && updateScheduleDto.totalSeats !== undefined) {
      if (updateScheduleDto.availableSeat > updateScheduleDto.totalSeats) {
        throw new BadRequestException('Available seats cannot exceed total seats');
      }
    }

    // Update status based on available seats
    if (updateScheduleDto.availableSeat !== undefined) {
      updateScheduleDto.status = updateScheduleDto.availableSeat === 0 
        ? ScheduleStatus.FULL 
        : ScheduleStatus.AVAILABLE;
    }

    const schedule = await this.scheduleRepository.update(id, updateData);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return this.mapToResponseDto(schedule);
  }

  async delete(id: number): Promise<void> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    await this.scheduleRepository.delete(id);
  }

  async findByRouteAndDate(routeId: number, departureDate: string): Promise<ScheduleWithDetailsResponseDto[]> {
    const schedules = await this.scheduleRepository.findByRouteAndDate(routeId, departureDate);
    return schedules.map(schedule => this.mapToDetailsResponseDto(schedule));
  }

  async findByBusAndDate(busId: number, departureDate: string): Promise<ScheduleWithDetailsResponseDto[]> {
    const schedules = await this.scheduleRepository.findByBusAndDate(busId, departureDate);
    return schedules.map(schedule => this.mapToDetailsResponseDto(schedule));
  }

  async updateAvailableSeats(id: number, seatsToBook: number): Promise<void> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    if (schedule.availableSeat < seatsToBook) {
      throw new BadRequestException('Not enough available seats');
    }

    await this.scheduleRepository.updateAvailableSeats(id, seatsToBook);
  }

  async getPopularRoutes(): Promise<ScheduleWithDetailsResponseDto[]> {
    // This would typically involve more complex logic to determine popular routes
    // For now, we'll return schedules with most available seats
    const queryDto: ScheduleQueryDto = {
      page: 1,
      limit: 10,
      status: ScheduleStatus.AVAILABLE,
      sortBy: 'availableSeat',
      sortOrder: 'DESC',
    };

    const { schedules } = await this.scheduleRepository.findAll(queryDto);
    return schedules.map(schedule => this.mapToDetailsResponseDto(schedule));
  }

  private mapToResponseDto(schedule: Schedule): ScheduleResponseDto {
    return {
      id: schedule.id,
      routeId: schedule.routeId,
      busId: schedule.busId,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      availableSeat: schedule.availableSeat,
      totalSeats: schedule.totalSeats,
      status: schedule.status,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  private mapToDetailsResponseDto(schedule: Schedule): ScheduleWithDetailsResponseDto {
    const baseDto = this.mapToResponseDto(schedule);
    
    return {
      ...baseDto,
      route: schedule.route ? {
        id: schedule.route.id,
        price: schedule.route.price,
        duration: schedule.route.duration,
        distance: schedule.route.distance,
        departureStation: {
          id: schedule.route.departureStation?.id,
          name: schedule.route.departureStation?.name,
          location: schedule.route.departureStation?.location,
        },
        arrivalStation: {
          id: schedule.route.arrivalStation?.id,
          name: schedule.route.arrivalStation?.name,
          location: schedule.route.arrivalStation?.location,
        },
      } : undefined,
      bus: schedule.bus ? {
        id: schedule.bus.id,
        name: schedule.bus.name,
        licensePlate: schedule.bus.license_plate,
        capacity: schedule.bus.capacity,
        company: {
          id: schedule.bus.company?.id,
          companyName: schedule.bus.company?.company_name,
        },
      } : undefined,
    };
  }
}
