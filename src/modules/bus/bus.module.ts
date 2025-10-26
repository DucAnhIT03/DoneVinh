import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusService } from './services/bus.service';
import { BusController } from './controllers/bus.controller';
import { BusRepository } from './repositories/bus.repository';
import { Bus } from '../../shared/schemas/bus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bus])],
  controllers: [BusController],
  providers: [BusService, BusRepository],
  exports: [BusService, BusRepository],
})
export class BusModule {}

