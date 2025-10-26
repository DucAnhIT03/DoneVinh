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
import { TicketService } from '../services/ticket.service';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';
import { TicketQueryDto } from '../dtos/ticket-query.dto';
import { BookTicketDto, CancelTicketDto } from '../dtos/book-ticket.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Post('book')
  @UseGuards(JwtAuthGuard)
  bookTicket(@Body() bookTicketDto: BookTicketDto) {
    return this.ticketService.bookTicket(bookTicketDto);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  cancelTicket(@Body() cancelTicketDto: CancelTicketDto) {
    return this.ticketService.cancelTicket(cancelTicketDto);
  }

  @Get()
  findAll(@Query() queryDto: TicketQueryDto) {
    return this.ticketService.findAll(queryDto);
  }

  @Get('statistics')
  getTicketStatistics() {
    return this.ticketService.getTicketStatistics();
  }

  @Get('date-range')
  findTicketsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    return this.ticketService.findTicketsByDateRange(startDate, endDate);
  }

  @Get('schedule/:scheduleId')
  findBySchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number) {
    return this.ticketService.findBySchedule(scheduleId);
  }

  @Get('seat/:seatId')
  findBySeat(@Param('seatId', ParseIntPipe) seatId: number) {
    return this.ticketService.findBySeat(seatId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.delete(id);
  }
}

