import { ScheduleStatus } from '../../../shared/schemas/schedule.entity';

export class ScheduleResponseDto {
  id: number;
  routeId: number;
  busId: number;
  departureTime: Date;
  arrivalTime: Date;
  availableSeat: number;
  totalSeats: number;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ScheduleWithDetailsResponseDto extends ScheduleResponseDto {
  route?: {
    id: number;
    price: number;
    duration: number;
    distance: number;
    departureStation: {
      id: number;
      name: string;
      location: string;
    };
    arrivalStation: {
      id: number;
      name: string;
      location: string;
    };
  };
  bus?: {
    id: number;
    name: string;
    licensePlate: string;
    capacity: number;
    company: {
      id: number;
      companyName: string;
    };
  };
}


