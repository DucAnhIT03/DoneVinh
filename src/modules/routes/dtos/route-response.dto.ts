export class RouteResponseDto {
  id: number;
  departure_station_id: number;
  arrival_station_id: number;
  price: number;
  duration: number;
  distance: number;
  created_at: Date;
  updated_at: Date;
}

export class RouteWithDetailsResponseDto extends RouteResponseDto {
  departureStation?: {
    id: number;
    name: string;
    location?: string;
    image?: string;
  };
  arrivalStation?: {
    id: number;
    name: string;
    location?: string;
    image?: string;
  };
  schedules?: {
    id: number;
    departure_time: Date;
    arrival_time: Date;
    available_seat: number;
    total_seats: number;
    status: string;
    bus: {
      id: number;
      name: string;
      license_plate?: string;
      company: {
        id: number;
        company_name: string;
      };
    };
  }[];
  statistics?: {
    totalSchedules: number;
    totalTickets: number;
    averageOccupancy: number;
  };
}




