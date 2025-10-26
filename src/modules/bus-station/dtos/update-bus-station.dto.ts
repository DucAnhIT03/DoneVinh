import { PartialType } from '@nestjs/mapped-types';
import { CreateBusStationDto } from './create-bus-station.dto';

export class UpdateBusStationDto extends PartialType(CreateBusStationDto) {}



