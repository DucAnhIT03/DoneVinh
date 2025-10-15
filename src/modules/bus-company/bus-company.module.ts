import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusCompanyService } from './services/bus-company.service';
import { BusCompanyController } from './controllers/bus-company.controller';
import { BusCompany } from '../../shared/schemas/bus-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusCompany])],
  controllers: [BusCompanyController],
  providers: [BusCompanyService],
  exports: [BusCompanyService],
})
export class BusCompanyModule {}
