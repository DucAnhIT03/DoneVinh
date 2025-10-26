export class BusResponseDto {
  id: number;
  name: string;
  descriptions?: string;
  license_plate?: string;
  capacity: number;
  company_id: number;
  created_at: Date;
  updated_at: Date;
}

export class BusWithDetailsResponseDto extends BusResponseDto {
  company?: {
    id: number;
    company_name: string;
    image?: string;
    descriptions?: string;
  };
  busImages?: {
    id: number;
    image_url: string;
  }[];
  seats?: {
    id: number;
    seat_number: string;
    seat_type: string;
    status: string;
    price_for_seat_type: number;
  }[];
  schedules?: {
    id: number;
    departure_time: Date;
    arrival_time: Date;
    available_seat: number;
    total_seats: number;
    status: string;
  }[];
  busReviews?: {
    id: number;
    rating: number;
    review: string;
    created_at: Date;
    user: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }[];
}

