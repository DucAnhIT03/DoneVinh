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
import { StationService } from '../services/station.service';
import { CreateStationDto } from '../dtos/create-station.dto';
import { UpdateStationDto } from '../dtos/update-station.dto';
import { StationQueryDto } from '../dtos/station-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
  }

  @Get()
  findAll(@Query() queryDto: StationQueryDto) {
    return this.stationService.findAll(queryDto);
  }

  @Get('city/:city')
  findByCity(@Param('city') city: string) {
    return this.stationService.findByCity(city);
  }

  @Get('province/:province')
  findByProvince(@Param('province') province: string) {
    return this.stationService.findByProvince(province);
  }

  @Get('nearby')
  getNearbyStations(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.stationService.getNearbyStations(latitude, longitude, radius);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stationService.findOne(id);
  }

  @Get(':id/statistics')
  getStationStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.stationService.getStationStatistics(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationDto: UpdateStationDto,
  ) {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stationService.remove(id);
  }
}
