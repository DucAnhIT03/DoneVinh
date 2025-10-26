import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusRepository } from '../repositories/bus.repository';
import { CreateBusDto } from '../dtos/create-bus.dto';
import { UpdateBusDto } from '../dtos/update-bus.dto';
import { BusQueryDto } from '../dtos/bus-query.dto';
import { BusResponseDto, BusWithDetailsResponseDto } from '../dtos/bus-response.dto';
import { Bus } from '../../../shared/schemas/bus.entity';

@Injectable()
export class BusService {
  constructor(private readonly busRepository: BusRepository) {}

  async findAll(queryDto: BusQueryDto): Promise<{
    buses: BusResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { buses, total } = await this.busRepository.findAll(queryDto);
    
    const totalPages = Math.ceil(total / queryDto.limit);
    
    return {
      buses: buses.map(bus => this.mapToResponseDto(bus)),
      total,
      page: queryDto.page,
      limit: queryDto.limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<BusWithDetailsResponseDto> {
    const bus = await this.busRepository.findByIdWithDetails(id);
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return this.mapToDetailsResponseDto(bus);
  }

  async create(createBusDto: CreateBusDto): Promise<BusResponseDto> {
    // Validate capacity
    if (createBusDto.capacity <= 0) {
      throw new BadRequestException('Capacity must be greater than 0');
    }

    // Check if license plate is unique (if provided)
    if (createBusDto.license_plate) {
      const existingBus = await this.busRepository['busRepository'].findOne({
        where: { license_plate: createBusDto.license_plate }
      });
      if (existingBus) {
        throw new BadRequestException('License plate already exists');
      }
    }

    const bus = await this.busRepository.create(createBusDto);
    return this.mapToResponseDto(bus);
  }

  async update(id: number, updateBusDto: UpdateBusDto): Promise<BusResponseDto> {
    const existingBus = await this.busRepository.findById(id);
    if (!existingBus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    // Validate capacity if provided
    if (updateBusDto.capacity !== undefined && updateBusDto.capacity <= 0) {
      throw new BadRequestException('Capacity must be greater than 0');
    }

    // Check if license plate is unique (if provided)
    if (updateBusDto.license_plate) {
      const existingBusWithLicense = await this.busRepository['busRepository'].findOne({
        where: { license_plate: updateBusDto.license_plate }
      });
      if (existingBusWithLicense && existingBusWithLicense.id !== id) {
        throw new BadRequestException('License plate already exists');
      }
    }

    const bus = await this.busRepository.update(id, updateBusDto);
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return this.mapToResponseDto(bus);
  }

  async delete(id: number): Promise<void> {
    const bus = await this.busRepository.findById(id);
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    // Check if bus has active schedules
    const hasActiveSchedules = await this.busRepository['busRepository']
      .createQueryBuilder('bus')
      .leftJoin('bus.schedules', 'schedule')
      .where('bus.id = :id', { id })
      .andWhere('schedule.status = :status', { status: 'AVAILABLE' })
      .getCount() > 0;

    if (hasActiveSchedules) {
      throw new BadRequestException('Cannot delete bus with active schedules');
    }

    await this.busRepository.delete(id);
  }

  async findByCompany(companyId: number): Promise<BusWithDetailsResponseDto[]> {
    const buses = await this.busRepository.findByCompany(companyId);
    return buses.map(bus => this.mapToDetailsResponseDto(bus));
  }

  async getAvailableBuses(): Promise<BusWithDetailsResponseDto[]> {
    const buses = await this.busRepository.findAvailableBuses();
    return buses.map(bus => this.mapToDetailsResponseDto(bus));
  }

  async getBusesWithSchedules(): Promise<BusWithDetailsResponseDto[]> {
    const buses = await this.busRepository.findBusesWithSchedules();
    return buses.map(bus => this.mapToDetailsResponseDto(bus));
  }

  async getBusStatistics(id: number): Promise<{
    totalSchedules: number;
    totalTickets: number;
    averageRating: number;
    totalReviews: number;
  }> {
    const bus = await this.busRepository.findByIdWithDetails(id);
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    const totalSchedules = bus.schedules?.length || 0;
    const totalTickets = bus.schedules?.reduce((sum, schedule) => 
      sum + (schedule.totalSeats - schedule.availableSeat), 0) || 0;
    
    const reviews = bus.busReviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    return {
      totalSchedules,
      totalTickets,
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews,
    };
  }

  private mapToResponseDto(bus: Bus): BusResponseDto {
    return {
      id: bus.id,
      name: bus.name,
      descriptions: bus.descriptions,
      license_plate: bus.license_plate,
      capacity: bus.capacity,
      company_id: bus.company_id,
      created_at: bus.created_at,
      updated_at: bus.updated_at,
    };
  }

  private mapToDetailsResponseDto(bus: Bus): BusWithDetailsResponseDto {
    const baseDto = this.mapToResponseDto(bus);
    
    return {
      ...baseDto,
      company: bus.company ? {
        id: bus.company.id,
        company_name: bus.company.company_name,
        image: bus.company.image,
        descriptions: bus.company.descriptions,
      } : undefined,
      busImages: bus.busImages?.map(image => ({
        id: image.id,
        image_url: image.image_url,
      })) || [],
      seats: bus.seats?.map(seat => ({
        id: seat.id,
        seat_number: seat.seat_number,
        seat_type: seat.seat_type,
        status: seat.status,
        price_for_seat_type: seat.price_for_seat_type,
      })) || [],
      schedules: bus.schedules?.map(schedule => ({
        id: schedule.id,
        departure_time: schedule.departureTime,
        arrival_time: schedule.arrivalTime,
        available_seat: schedule.availableSeat,
        total_seats: schedule.totalSeats,
        status: schedule.status,
      })) || [],
      busReviews: bus.busReviews?.map(review => ({
        id: review.id,
        rating: review.rating,
        review: review.review,
        created_at: review.created_at,
        user: {
          id: review.user?.id,
          first_name: review.user?.first_name,
          last_name: review.user?.last_name,
        },
      })) || [],
    };
  }
}
