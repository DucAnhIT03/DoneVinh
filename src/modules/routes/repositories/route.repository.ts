import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Route } from '../../../shared/schemas/route.entity';
import { RouteQueryDto } from '../dtos/route-query.dto';

@Injectable()
export class RouteRepository {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async findAll(queryDto: RouteQueryDto): Promise<{ routes: Route[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);
    
    const [routes, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return { routes, total };
  }

  async findById(id: number): Promise<Route | null> {
    return this.routeRepository.findOne({
      where: { id },
      relations: ['departureStation', 'arrivalStation'],
    });
  }

  async findByIdWithDetails(id: number): Promise<Route | null> {
    return this.routeRepository.findOne({
      where: { id },
      relations: [
        'departureStation',
        'arrivalStation',
        'schedules',
        'schedules.bus',
        'schedules.bus.company',
      ],
    });
  }

  async create(routeData: Partial<Route>): Promise<Route> {
    const route = this.routeRepository.create(routeData);
    return this.routeRepository.save(route);
  }

  async update(id: number, routeData: Partial<Route>): Promise<Route | null> {
    await this.routeRepository.update(id, routeData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.routeRepository.delete(id);
  }

  async findByStations(departureStationId: number, arrivalStationId: number): Promise<Route[]> {
    return this.routeRepository.find({
      where: {
        departure_station_id: departureStationId,
        arrival_station_id: arrivalStationId,
      },
      relations: ['departureStation', 'arrivalStation'],
    });
  }

  async findRoutesByDepartureStation(departureStationId: number): Promise<Route[]> {
    return this.routeRepository.find({
      where: { departure_station_id: departureStationId },
      relations: ['departureStation', 'arrivalStation'],
    });
  }

  async findRoutesByArrivalStation(arrivalStationId: number): Promise<Route[]> {
    return this.routeRepository.find({
      where: { arrival_station_id: arrivalStationId },
      relations: ['departureStation', 'arrivalStation'],
    });
  }

  async findPopularRoutes(limit: number = 10): Promise<Route[]> {
    return this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.departureStation', 'departureStation')
      .leftJoinAndSelect('route.arrivalStation', 'arrivalStation')
      .leftJoin('route.schedules', 'schedule')
      .leftJoin('schedule.tickets', 'ticket')
      .select([
        'route.id',
        'route.departure_station_id',
        'route.arrival_station_id',
        'route.price',
        'route.duration',
        'route.distance',
        'departureStation.id',
        'departureStation.name',
        'arrivalStation.id',
        'arrivalStation.name',
      ])
      .addSelect('COUNT(ticket.id)', 'ticketCount')
      .groupBy('route.id')
      .orderBy('ticketCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findRoutesByPriceRange(minPrice: number, maxPrice: number): Promise<Route[]> {
    return this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.departureStation', 'departureStation')
      .leftJoinAndSelect('route.arrivalStation', 'arrivalStation')
      .where('route.price >= :minPrice', { minPrice })
      .andWhere('route.price <= :maxPrice', { maxPrice })
      .getMany();
  }

  private createQueryBuilder(queryDto: RouteQueryDto): SelectQueryBuilder<Route> {
    const queryBuilder = this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.departureStation', 'departureStation')
      .leftJoinAndSelect('route.arrivalStation', 'arrivalStation');

    // Apply filters
    if (queryDto.departure_station_id) {
      queryBuilder.andWhere('route.departure_station_id = :departureStationId', { 
        departureStationId: queryDto.departure_station_id 
      });
    }

    if (queryDto.arrival_station_id) {
      queryBuilder.andWhere('route.arrival_station_id = :arrivalStationId', { 
        arrivalStationId: queryDto.arrival_station_id 
      });
    }

    if (queryDto.minPrice !== undefined) {
      queryBuilder.andWhere('route.price >= :minPrice', { minPrice: queryDto.minPrice });
    }

    if (queryDto.maxPrice !== undefined) {
      queryBuilder.andWhere('route.price <= :maxPrice', { maxPrice: queryDto.maxPrice });
    }

    if (queryDto.maxDuration !== undefined) {
      queryBuilder.andWhere('route.duration <= :maxDuration', { maxDuration: queryDto.maxDuration });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(departureStation.name LIKE :search OR arrivalStation.name LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'id';
    const sortOrder = queryDto.sortOrder || 'ASC';
    queryBuilder.orderBy(`route.${sortBy}`, sortOrder);

    return queryBuilder;
  }
}
