import { SeatType, TicketStatus } from '../../../shared/schemas/ticket.entity';

export class TicketResponseDto {
  id: number;
  schedule_id: number;
  seat_id: number;
  departure_time: Date;
  arrival_time: Date;
  seat_type: SeatType;
  price: number;
  status: TicketStatus;
  created_at: Date;
  updated_at: Date;
}

export class TicketWithDetailsResponseDto extends TicketResponseDto {
  schedule?: {
    id: number;
    departure_time: Date;
    arrival_time: Date;
    available_seat: number;
    total_seats: number;
    status: string;
    route: {
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
    bus: {
      id: number;
      name: string;
      license_plate: string;
      capacity: number;
      company: {
        id: number;
        company_name: string;
      };
    };
  };
  seat?: {
    id: number;
    seat_number: string;
    seat_type: string;
    status: string;
    price_for_seat_type: number;
  };
  payments?: {
    id: number;
    payment_method: string;
    amount: number;
    status: string;
    created_at: Date;
  }[];
}

