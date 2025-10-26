import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusStationService } from './services/bus-station.service';
import { BusStationController } from './controllers/bus-station.controller';
import { BusStation } from '../../shared/schemas/bus-station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusStation]),
  ],
  controllers: [BusStationController],
  providers: [BusStationService],
  exports: [BusStationService],
})
export class BusStationModule {}
