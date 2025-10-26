export class BusImageResponseDto {
  id: number;
  image_url: string;
  bus_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class BusImageWithDetailsResponseDto extends BusImageResponseDto {
  bus?: {
    id: number;
    name: string;
    license_plate?: string;
    capacity: number;
    company_id: number;
  };
}




