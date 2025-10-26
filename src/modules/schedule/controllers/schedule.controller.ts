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
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';
import { ScheduleQueryDto } from '../dtos/schedule-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll(@Query() queryDto: ScheduleQueryDto) {
    return this.scheduleService.findAll(queryDto);
  }

  @Get('popular-routes')
  getPopularRoutes() {
    return this.scheduleService.getPopularRoutes();
  }

  @Get('route/:routeId')
  findByRouteAndDate(
    @Param('routeId', ParseIntPipe) routeId: number,
    @Query('departureDate') departureDate: string,
  ) {
    if (!departureDate) {
      throw new Error('Departure date is required');
    }
    return this.scheduleService.findByRouteAndDate(routeId, departureDate);
  }

  @Get('bus/:busId')
  findByBusAndDate(
    @Param('busId', ParseIntPipe) busId: number,
    @Query('departureDate') departureDate: string,
  ) {
    if (!departureDate) {
      throw new Error('Departure date is required');
    }
    return this.scheduleService.findByBusAndDate(busId, departureDate);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.delete(id);
  }

  @Patch(':id/update-seats')
  @UseGuards(JwtAuthGuard)
  updateAvailableSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body('seatsToBook', ParseIntPipe) seatsToBook: number,
  ) {
    return this.scheduleService.updateAvailableSeats(id, seatsToBook);
  }
}


