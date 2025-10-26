import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './services/schedule.service';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleRepository } from './repositories/schedule.repository';
import { Schedule } from '../../shared/schemas/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  exports: [ScheduleService, ScheduleRepository],
})
export class ScheduleModule {}


