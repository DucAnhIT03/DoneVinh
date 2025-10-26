import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationService } from './services/station.service';
import { StationController } from './controllers/station.controller';
import { Station } from '../../shared/schemas/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
  ],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}
