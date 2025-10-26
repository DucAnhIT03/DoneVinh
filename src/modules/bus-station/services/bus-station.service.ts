import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusStation } from '../../../shared/schemas/bus-station.entity';
import { CreateBusStationDto } from '../dtos/create-bus-station.dto';
import { UpdateBusStationDto } from '../dtos/update-bus-station.dto';
import { BusStationQueryDto } from '../dtos/bus-station-query.dto';

@Injectable()
export class BusStationService {
  constructor(
    @InjectRepository(BusStation) private busStationRepository: Repository<BusStation>,
  ) {}

  async create(createBusStationDto: CreateBusStationDto): Promise<BusStation> {
    try {
      // Validate that arrival time is before departure time
      const arrivalTime = new Date(createBusStationDto.arrivalTime);
      const departureTime = new Date(createBusStationDto.departureTime);
      
      if (arrivalTime >= departureTime) {
        throw new BadRequestException('Arrival time must be before departure time');
      }

      const busStation = this.busStationRepository.create(createBusStationDto);
      return await this.busStationRepository.save(busStation);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid data provided');
      }
      throw error;
    }
  }

  async findAll(queryDto: BusStationQueryDto) {
    const {
      stationId,
      busId,
      startDate,
      endDate,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'arrivalTime',
      sortOrder = 'asc',
    } = queryDto;

    const queryBuilder = this.busStationRepository
      .createQueryBuilder('busStation')
      .leftJoinAndSelect('busStation.station', 'station');

    if (stationId) {
      queryBuilder.andWhere('busStation.stationId = :stationId', { stationId });
    }

    if (busId) {
      queryBuilder.andWhere('busStation.busId = :busId', { busId });
    }

    if (startDate || endDate) {
      if (startDate) {
        queryBuilder.andWhere('busStation.arrivalTime >= :startDate', { startDate: new Date(startDate) });
      }
      if (endDate) {
        queryBuilder.andWhere('busStation.arrivalTime <= :endDate', { endDate: new Date(endDate) });
      }
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('busStation.isActive = :isActive', { isActive });
    }

    queryBuilder.orderBy(`busStation.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [busStations, total] = await queryBuilder.getManyAndCount();

    return {
      data: busStations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<BusStation> {
    const busStation = await this.busStationRepository.findOne({
      where: { id },
      relations: ['station']
    });
    
    if (!busStation) {
      throw new NotFoundException('Bus station not found');
    }
    
    return busStation;
  }

  async update(id: number, updateBusStationDto: UpdateBusStationDto): Promise<BusStation> {
    try {
      // Validate time if provided
      if (updateBusStationDto.arrivalTime && updateBusStationDto.departureTime) {
        const arrivalTime = new Date(updateBusStationDto.arrivalTime);
        const departureTime = new Date(updateBusStationDto.departureTime);
        
        if (arrivalTime >= departureTime) {
          throw new BadRequestException('Arrival time must be before departure time');
        }
      }

      const busStation = await this.busStationRepository.findOne({
        where: { id },
        relations: ['station']
      });
      
      if (!busStation) {
        throw new NotFoundException('Bus station not found');
      }

      Object.assign(busStation, updateBusStationDto);
      return await this.busStationRepository.save(busStation);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid data provided');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.busStationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Bus station not found');
    }
  }

  async findByStation(stationId: number): Promise<BusStation[]> {
    return this.busStationRepository.find({
      where: { stationId, isActive: true },
      relations: ['station'],
      order: { arrivalTime: 'ASC' }
    });
  }

  async findByBus(busId: number): Promise<BusStation[]> {
    return this.busStationRepository.find({
      where: { busId, isActive: true },
      relations: ['station'],
      order: { sequence: 'ASC' }
    });
  }

  async getScheduleByStation(stationId: number, date?: string) {
    const queryBuilder = this.busStationRepository
      .createQueryBuilder('busStation')
      .leftJoinAndSelect('busStation.station', 'station')
      .where('busStation.stationId = :stationId', { stationId })
      .andWhere('busStation.isActive = :isActive', { isActive: true });
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      queryBuilder
        .andWhere('busStation.arrivalTime >= :startDate', { startDate })
        .andWhere('busStation.arrivalTime < :endDate', { endDate });
    }

    return queryBuilder
      .orderBy('busStation.arrivalTime', 'ASC')
      .getMany();
  }

  async getScheduleByBus(busId: number, date?: string) {
    const queryBuilder = this.busStationRepository
      .createQueryBuilder('busStation')
      .leftJoinAndSelect('busStation.station', 'station')
      .where('busStation.busId = :busId', { busId })
      .andWhere('busStation.isActive = :isActive', { isActive: true });
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      queryBuilder
        .andWhere('busStation.arrivalTime >= :startDate', { startDate })
        .andWhere('busStation.arrivalTime < :endDate', { endDate });
    }

    return queryBuilder
      .orderBy('busStation.sequence', 'ASC')
      .getMany();
  }

  async getBusStationStatistics(id: number) {
    const busStation = await this.findOne(id);
    
    return {
      busStation,
      occupancyRate: (busStation.totalSeats - busStation.availableSeats) / busStation.totalSeats * 100,
      isFullyBooked: busStation.availableSeats === 0,
      timeUntilArrival: this.calculateTimeUntilArrival(busStation.arrivalTime),
    };
  }

  private calculateTimeUntilArrival(arrivalTime: Date): string {
    const now = new Date();
    const diff = arrivalTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Departed';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}
