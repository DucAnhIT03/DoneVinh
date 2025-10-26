import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RouteRepository } from '../repositories/route.repository';
import { CreateRouteDto } from '../dtos/create-route.dto';
import { UpdateRouteDto } from '../dtos/update-route.dto';
import { RouteQueryDto } from '../dtos/route-query.dto';
import { RouteResponseDto, RouteWithDetailsResponseDto } from '../dtos/route-response.dto';
import { Route } from '../../../shared/schemas/route.entity';

@Injectable()
export class RouteService {
  constructor(private readonly routeRepository: RouteRepository) {}

  async findAll(queryDto: RouteQueryDto): Promise<{
    routes: RouteResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { routes, total } = await this.routeRepository.findAll(queryDto);
    
    const totalPages = Math.ceil(total / queryDto.limit);
    
    return {
      routes: routes.map(route => this.mapToResponseDto(route)),
      total,
      page: queryDto.page,
      limit: queryDto.limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<RouteWithDetailsResponseDto> {
    const route = await this.routeRepository.findByIdWithDetails(id);
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return this.mapToDetailsResponseDto(route);
  }

  async create(createRouteDto: CreateRouteDto): Promise<RouteResponseDto> {
    // Validate that departure and arrival stations are different
    if (createRouteDto.departure_station_id === createRouteDto.arrival_station_id) {
      throw new BadRequestException('Departure and arrival stations must be different');
    }

    // Validate price
    if (createRouteDto.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    // Validate duration
    if (createRouteDto.duration <= 0) {
      throw new BadRequestException('Duration must be greater than 0');
    }

    // Validate distance
    if (createRouteDto.distance <= 0) {
      throw new BadRequestException('Distance must be greater than 0');
    }

    // Check if route already exists
    const existingRoutes = await this.routeRepository.findByStations(
      createRouteDto.departure_station_id,
      createRouteDto.arrival_station_id
    );
    
    if (existingRoutes.length > 0) {
      throw new BadRequestException('Route between these stations already exists');
    }

    const route = await this.routeRepository.create(createRouteDto);
    return this.mapToResponseDto(route);
  }

  async update(id: number, updateRouteDto: UpdateRouteDto): Promise<RouteResponseDto> {
    const existingRoute = await this.routeRepository.findById(id);
    if (!existingRoute) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    // Validate that departure and arrival stations are different if both are provided
    if (updateRouteDto.departure_station_id && updateRouteDto.arrival_station_id) {
      if (updateRouteDto.departure_station_id === updateRouteDto.arrival_station_id) {
        throw new BadRequestException('Departure and arrival stations must be different');
      }
    }

    // Validate price if provided
    if (updateRouteDto.price !== undefined && updateRouteDto.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    // Validate duration if provided
    if (updateRouteDto.duration !== undefined && updateRouteDto.duration <= 0) {
      throw new BadRequestException('Duration must be greater than 0');
    }

    // Validate distance if provided
    if (updateRouteDto.distance !== undefined && updateRouteDto.distance <= 0) {
      throw new BadRequestException('Distance must be greater than 0');
    }

    // Check if route already exists (if stations are being updated)
    if (updateRouteDto.departure_station_id || updateRouteDto.arrival_station_id) {
      const departureStationId = updateRouteDto.departure_station_id || existingRoute.departure_station_id;
      const arrivalStationId = updateRouteDto.arrival_station_id || existingRoute.arrival_station_id;
      
      const existingRoutes = await this.routeRepository.findByStations(
        departureStationId,
        arrivalStationId
      );
      
      const conflictingRoute = existingRoutes.find(route => route.id !== id);
      if (conflictingRoute) {
        throw new BadRequestException('Route between these stations already exists');
      }
    }

    const route = await this.routeRepository.update(id, updateRouteDto);
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return this.mapToResponseDto(route);
  }

  async delete(id: number): Promise<void> {
    const route = await this.routeRepository.findById(id);
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    // Check if route has active schedules
    const routeWithSchedules = await this.routeRepository.findByIdWithDetails(id);
    if (routeWithSchedules?.schedules && routeWithSchedules.schedules.length > 0) {
      throw new BadRequestException('Cannot delete route with active schedules');
    }

    await this.routeRepository.delete(id);
  }

  async findByStations(departureStationId: number, arrivalStationId: number): Promise<RouteWithDetailsResponseDto[]> {
    const routes = await this.routeRepository.findByStations(departureStationId, arrivalStationId);
    return routes.map(route => this.mapToDetailsResponseDto(route));
  }

  async findByDepartureStation(departureStationId: number): Promise<RouteWithDetailsResponseDto[]> {
    const routes = await this.routeRepository.findRoutesByDepartureStation(departureStationId);
    return routes.map(route => this.mapToDetailsResponseDto(route));
  }

  async findByArrivalStation(arrivalStationId: number): Promise<RouteWithDetailsResponseDto[]> {
    const routes = await this.routeRepository.findRoutesByArrivalStation(arrivalStationId);
    return routes.map(route => this.mapToDetailsResponseDto(route));
  }

  async getPopularRoutes(limit: number = 10): Promise<RouteWithDetailsResponseDto[]> {
    const routes = await this.routeRepository.findPopularRoutes(limit);
    return routes.map(route => this.mapToDetailsResponseDto(route));
  }

  async getRouteStatistics(id: number): Promise<{
    totalSchedules: number;
    totalTickets: number;
    averageOccupancy: number;
  }> {
    const route = await this.routeRepository.findByIdWithDetails(id);
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    const schedules = route.schedules || [];
    const totalSchedules = schedules.length;
    
    let totalTickets = 0;
    let totalCapacity = 0;
    
    schedules.forEach(schedule => {
      const soldTickets = schedule.totalSeats - schedule.availableSeat;
      totalTickets += soldTickets;
      totalCapacity += schedule.totalSeats;
    });

    const averageOccupancy = totalCapacity > 0 ? (totalTickets / totalCapacity) * 100 : 0;

    return {
      totalSchedules,
      totalTickets,
      averageOccupancy: Math.round(averageOccupancy * 100) / 100,
    };
  }

  private mapToResponseDto(route: Route): RouteResponseDto {
    return {
      id: route.id,
      departure_station_id: route.departure_station_id,
      arrival_station_id: route.arrival_station_id,
      price: route.price,
      duration: route.duration,
      distance: route.distance,
      created_at: route.created_at,
      updated_at: route.updated_at,
    };
  }

  private mapToDetailsResponseDto(route: Route): RouteWithDetailsResponseDto {
    const baseDto = this.mapToResponseDto(route);
    
    return {
      ...baseDto,
      departureStation: route.departureStation ? {
        id: route.departureStation.id,
        name: route.departureStation.name,
        location: route.departureStation.location,
        image: route.departureStation.image,
      } : undefined,
      arrivalStation: route.arrivalStation ? {
        id: route.arrivalStation.id,
        name: route.arrivalStation.name,
        location: route.arrivalStation.location,
        image: route.arrivalStation.image,
      } : undefined,
      schedules: route.schedules?.map(schedule => ({
        id: schedule.id,
        departure_time: schedule.departureTime,
        arrival_time: schedule.arrivalTime,
        available_seat: schedule.availableSeat,
        total_seats: schedule.totalSeats,
        status: schedule.status,
        bus: {
          id: schedule.bus.id,
          name: schedule.bus.name,
          license_plate: schedule.bus.license_plate,
          company: {
            id: schedule.bus.company.id,
            company_name: schedule.bus.company.company_name,
          },
        },
      })) || [],
    };
  }
}




