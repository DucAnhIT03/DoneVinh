import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusImageRepository } from '../repositories/bus-image.repository';
import { CreateBusImageDto } from '../dtos/create-bus-image.dto';
import { UpdateBusImageDto } from '../dtos/update-bus-image.dto';
import { BusImageQueryDto } from '../dtos/bus-image-query.dto';
import { BusImageResponseDto, BusImageWithDetailsResponseDto } from '../dtos/bus-image-response.dto';
import { BusImage } from '../../../shared/schemas/bus-image.entity';

@Injectable()
export class BusImageService {
  constructor(private readonly busImageRepository: BusImageRepository) {}

  async findAll(queryDto: BusImageQueryDto): Promise<{
    busImages: BusImageResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { busImages, total } = await this.busImageRepository.findAll(queryDto);
    
    const totalPages = Math.ceil(total / queryDto.limit);
    
    return {
      busImages: busImages.map(busImage => this.mapToResponseDto(busImage)),
      total,
      page: queryDto.page,
      limit: queryDto.limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<BusImageWithDetailsResponseDto> {
    const busImage = await this.busImageRepository.findByIdWithDetails(id);
    if (!busImage) {
      throw new NotFoundException(`Bus image with ID ${id} not found`);
    }
    return this.mapToDetailsResponseDto(busImage);
  }

  async create(createBusImageDto: CreateBusImageDto): Promise<BusImageResponseDto> {
    // Validate that the bus exists by checking if we can find a bus with this ID
    // We need to inject BusRepository or use a different approach
    // For now, we'll create the bus image and let the database constraint handle validation
    
    const newBusImage = await this.busImageRepository.create(createBusImageDto);
    return this.mapToResponseDto(newBusImage);
  }

  async update(id: number, updateBusImageDto: UpdateBusImageDto): Promise<BusImageResponseDto> {
    const existingBusImage = await this.busImageRepository.findById(id);
    if (!existingBusImage) {
      throw new NotFoundException(`Bus image with ID ${id} not found`);
    }

    // Validate bus_id if provided
    if (updateBusImageDto.bus_id) {
      // Let database constraint handle validation
      // In a real application, you might want to inject BusRepository to validate
    }

    const busImage = await this.busImageRepository.update(id, updateBusImageDto);
    if (!busImage) {
      throw new NotFoundException(`Bus image with ID ${id} not found`);
    }
    return this.mapToResponseDto(busImage);
  }

  async delete(id: number): Promise<void> {
    const busImage = await this.busImageRepository.findById(id);
    if (!busImage) {
      throw new NotFoundException(`Bus image with ID ${id} not found`);
    }

    await this.busImageRepository.delete(id);
  }

  async findByBusId(busId: number): Promise<BusImageWithDetailsResponseDto[]> {
    const busImages = await this.busImageRepository.findByBusId(busId);
    return busImages.map(busImage => this.mapToDetailsResponseDto(busImage));
  }

  async getBusImageStatistics(busId: number): Promise<{
    totalImages: number;
    busInfo: {
      id: number;
      name: string;
      license_plate?: string;
      capacity: number;
    };
  }> {
    const busImages = await this.busImageRepository.findByBusId(busId);
    
    if (busImages.length === 0) {
      throw new NotFoundException(`No images found for bus with ID ${busId}`);
    }

    const bus = busImages[0].bus;
    
    return {
      totalImages: busImages.length,
      busInfo: {
        id: bus.id,
        name: bus.name,
        license_plate: bus.license_plate,
        capacity: bus.capacity,
      },
    };
  }

  private mapToResponseDto(busImage: BusImage): BusImageResponseDto {
    return {
      id: busImage.id,
      image_url: busImage.image_url,
      bus_id: busImage.bus_id,
      created_at: busImage.created_at,
      updated_at: busImage.updated_at,
    };
  }

  private mapToDetailsResponseDto(busImage: BusImage): BusImageWithDetailsResponseDto {
    const baseDto = this.mapToResponseDto(busImage);
    
    return {
      ...baseDto,
      bus: busImage.bus ? {
        id: busImage.bus.id,
        name: busImage.bus.name,
        license_plate: busImage.bus.license_plate,
        capacity: busImage.bus.capacity,
        company_id: busImage.bus.company_id,
      } : undefined,
    };
  }
}
