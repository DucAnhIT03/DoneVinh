import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusImageService } from './services/bus-image.service';
import { BusImageController } from './controllers/bus-image.controller';
import { BusImageRepository } from './repositories/bus-image.repository';
import { BusImage } from '../../shared/schemas/bus-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusImage])],
  controllers: [BusImageController],
  providers: [BusImageService, BusImageRepository],
  exports: [BusImageService, BusImageRepository],
})
export class BusImageModule {}




