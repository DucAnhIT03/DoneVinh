import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../../../shared/schemas/station.entity';
import { CreateStationDto } from '../dtos/create-station.dto';
import { UpdateStationDto } from '../dtos/update-station.dto';
import { StationQueryDto } from '../dtos/station-query.dto';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station) private stationRepository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    try {
      const station = this.stationRepository.create(createStationDto);
      return await this.stationRepository.save(station);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Station name already exists');
      }
      throw new BadRequestException('Failed to create station');
    }
  }

  async findAll(queryDto: StationQueryDto) {
    const {
      search,
      city,
      province,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = queryDto;

    const queryBuilder = this.stationRepository.createQueryBuilder('station');

    if (search) {
      queryBuilder.andWhere(
        '(station.name LIKE :search OR station.address LIKE :search OR station.city LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (city) {
      queryBuilder.andWhere('station.city LIKE :city', { city: `%${city}%` });
    }

    if (province) {
      queryBuilder.andWhere('station.province LIKE :province', { province: `%${province}%` });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('station.isActive = :isActive', { isActive });
    }

    queryBuilder.orderBy(`station.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [stations, total] = await queryBuilder.getManyAndCount();

    return {
      data: stations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) {
      throw new NotFoundException('Station not found');
    }
    return station;
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<Station> {
    try {
      const station = await this.stationRepository.findOne({ where: { id } });
      if (!station) {
        throw new NotFoundException('Station not found');
      }

      Object.assign(station, updateStationDto);
      return await this.stationRepository.save(station);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Station name already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.stationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Station not found');
    }
  }

  async findByCity(city: string): Promise<Station[]> {
    return this.stationRepository
      .createQueryBuilder('station')
      .where('station.city LIKE :city', { city: `%${city}%` })
      .andWhere('station.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findByProvince(province: string): Promise<Station[]> {
    return this.stationRepository
      .createQueryBuilder('station')
      .where('station.province LIKE :province', { province: `%${province}%` })
      .andWhere('station.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async getNearbyStations(latitude: number, longitude: number, radius: number = 10): Promise<Station[]> {
    // Simple distance calculation (for production, use proper geospatial queries)
    const stations = await this.stationRepository.find({ where: { isActive: true } });
    
    return stations.filter(station => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        station.latitude,
        station.longitude
      );
      return distance <= radius;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getStationStatistics(id: number) {
    const station = await this.findOne(id);
    
    // This would typically involve more complex queries with bus-station relationships
    return {
      station,
      totalBuses: 0, // Would be calculated from bus-station relationships
      averageOccupancy: station.currentOccupancy / station.capacity * 100,
      facilities: station.facilities,
    };
  }
}
