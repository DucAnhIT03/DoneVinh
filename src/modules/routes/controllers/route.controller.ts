import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RouteService } from '../services/route.service';
import { CreateRouteDto } from '../dtos/create-route.dto';
import { UpdateRouteDto } from '../dtos/update-route.dto';
import { RouteQueryDto } from '../dtos/route-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  findAll(@Query() queryDto: RouteQueryDto) {
    return this.routeService.findAll(queryDto);
  }

  @Get('popular')
  getPopularRoutes(@Query('limit') limit?: number) {
    return this.routeService.getPopularRoutes(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('search')
  searchRoutes(
    @Query('departure_station_id', ParseIntPipe) departureStationId: number,
    @Query('arrival_station_id', ParseIntPipe) arrivalStationId: number,
  ) {
    return this.routeService.findByStations(departureStationId, arrivalStationId);
  }

  @Get('departure/:departureStationId')
  findByDepartureStation(@Param('departureStationId', ParseIntPipe) departureStationId: number) {
    return this.routeService.findByDepartureStation(departureStationId);
  }

  @Get('arrival/:arrivalStationId')
  findByArrivalStation(@Param('arrivalStationId', ParseIntPipe) arrivalStationId: number) {
    return this.routeService.findByArrivalStation(arrivalStationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.routeService.findById(id);
  }

  @Get(':id/statistics')
  getRouteStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.routeService.getRouteStatistics(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRouteDto: UpdateRouteDto,
  ) {
    return this.routeService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.routeService.delete(id);
  }
}




