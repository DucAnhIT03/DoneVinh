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
import { BusService } from '../services/bus.service';
import { CreateBusDto } from '../dtos/create-bus.dto';
import { UpdateBusDto } from '../dtos/update-bus.dto';
import { BusQueryDto } from '../dtos/bus-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('buses')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBusDto: CreateBusDto) {
    return this.busService.create(createBusDto);
  }

  @Get()
  findAll(@Query() queryDto: BusQueryDto) {
    return this.busService.findAll(queryDto);
  }

  @Get('available')
  getAvailableBuses() {
    return this.busService.getAvailableBuses();
  }

  @Get('with-schedules')
  getBusesWithSchedules() {
    return this.busService.getBusesWithSchedules();
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.busService.findByCompany(companyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.busService.findById(id);
  }

  @Get(':id/statistics')
  getBusStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.busService.getBusStatistics(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusDto: UpdateBusDto,
  ) {
    return this.busService.update(id, updateBusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.busService.delete(id);
  }
}

