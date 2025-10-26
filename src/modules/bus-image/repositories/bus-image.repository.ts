import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BusImage } from '../../../shared/schemas/bus-image.entity';
import { BusImageQueryDto } from '../dtos/bus-image-query.dto';

@Injectable()
export class BusImageRepository {
  constructor(
    @InjectRepository(BusImage)
    private readonly busImageRepository: Repository<BusImage>,
  ) {}

  async findAll(queryDto: BusImageQueryDto): Promise<{ busImages: BusImage[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);
    
    const [busImages, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return { busImages, total };
  }

  async findById(id: number): Promise<BusImage | null> {
    return this.busImageRepository.findOne({
      where: { id },
      relations: ['bus'],
    });
  }

  async findByIdWithDetails(id: number): Promise<BusImage | null> {
    return this.busImageRepository.findOne({
      where: { id },
      relations: ['bus', 'bus.company'],
    });
  }

  async create(busImageData: Partial<BusImage>): Promise<BusImage> {
    const busImage = this.busImageRepository.create(busImageData);
    return this.busImageRepository.save(busImage);
  }

  async update(id: number, busImageData: Partial<BusImage>): Promise<BusImage | null> {
    await this.busImageRepository.update(id, busImageData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.busImageRepository.delete(id);
  }

  async findByBusId(busId: number): Promise<BusImage[]> {
    return this.busImageRepository.find({
      where: { bus_id: busId },
      relations: ['bus'],
    });
  }

  async findImagesByBusIds(busIds: number[]): Promise<BusImage[]> {
    return this.busImageRepository
      .createQueryBuilder('busImage')
      .leftJoinAndSelect('busImage.bus', 'bus')
      .where('busImage.bus_id IN (:...busIds)', { busIds })
      .orderBy('busImage.id', 'ASC')
      .getMany();
  }

  private createQueryBuilder(queryDto: BusImageQueryDto): SelectQueryBuilder<BusImage> {
    const queryBuilder = this.busImageRepository
      .createQueryBuilder('busImage')
      .leftJoinAndSelect('busImage.bus', 'bus')
      .leftJoinAndSelect('bus.company', 'company');

    // Apply filters
    if (queryDto.bus_id) {
      queryBuilder.andWhere('busImage.bus_id = :busId', { busId: queryDto.bus_id });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(busImage.image_url LIKE :search OR bus.name LIKE :search OR company.company_name LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'id';
    const sortOrder = queryDto.sortOrder || 'ASC';
    queryBuilder.orderBy(`busImage.${sortBy}`, sortOrder);

    return queryBuilder;
  }
}




