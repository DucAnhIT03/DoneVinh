import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BusStationService } from '../services/bus-station.service';
import { CreateBusStationDto } from '../dtos/create-bus-station.dto';
import { UpdateBusStationDto } from '../dtos/update-bus-station.dto';
import { BusStationQueryDto } from '../dtos/bus-station-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('bus-stations')
export class BusStationController {
  constructor(private readonly busStationService: BusStationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBusStationDto: CreateBusStationDto) {
    return this.busStationService.create(createBusStationDto);
  }

  @Get()
  findAll(@Query() queryDto: BusStationQueryDto) {
    return this.busStationService.findAll(queryDto);
  }

  @Get('station/:stationId')
  findByStation(@Param('stationId', ParseIntPipe) stationId: number) {
    return this.busStationService.findByStation(stationId);
  }

  @Get('bus/:busId')
  findByBus(@Param('busId', ParseIntPipe) busId: number) {
    return this.busStationService.findByBus(busId);
  }

  @Get('schedule/station/:stationId')
  getScheduleByStation(
    @Param('stationId', ParseIntPipe) stationId: number,
    @Query('date') date?: string,
  ) {
    return this.busStationService.getScheduleByStation(stationId, date);
  }

  @Get('schedule/bus/:busId')
  getScheduleByBus(
    @Param('busId', ParseIntPipe) busId: number,
    @Query('date') date?: string,
  ) {
    return this.busStationService.getScheduleByBus(busId, date);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.busStationService.findOne(id);
  }

  @Get(':id/statistics')
  getBusStationStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.busStationService.getBusStationStatistics(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusStationDto: UpdateBusStationDto,
  ) {
    return this.busStationService.update(id, updateBusStationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.busStationService.remove(id);
  }
}
