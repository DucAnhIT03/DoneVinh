import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './services/ticket.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketRepository } from './repositories/ticket.repository';
import { Ticket } from '../../shared/schemas/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService, TicketRepository],
})
export class TicketModule {}

