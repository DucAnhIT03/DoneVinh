import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { BusCompany } from '../../../shared/schemas/bus-company.entity';
import { CreateBusCompanyDto, UpdateBusCompanyDto, BusCompanyQueryDto } from '../dtos/request/bus-company.dto';
import { BusCompanyResponseDto } from '../dtos/response/bus-company-response.dto';

@Injectable()
export class BusCompanyService {
  constructor(
    @InjectRepository(BusCompany)
    private busCompanyRepository: Repository<BusCompany>,
  ) {}

  async create(createBusCompanyDto: CreateBusCompanyDto): Promise<BusCompanyResponseDto> {
    const busCompany = this.busCompanyRepository.create(createBusCompanyDto);
    const savedBusCompany = await this.busCompanyRepository.save(busCompany);
    
    return {
      id: savedBusCompany.id,
      company_name: savedBusCompany.company_name,
      image: savedBusCompany.image,
      descriptions: savedBusCompany.descriptions,
      created_at: savedBusCompany.created_at,
      updated_at: savedBusCompany.updated_at,
    };
  }

  async findAll(queryDto: BusCompanyQueryDto): Promise<{
    data: BusCompanyResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = queryDto;
    
    const queryBuilder = this.busCompanyRepository.createQueryBuilder('busCompany');
    
    if (search) {
      queryBuilder.where('busCompany.company_name LIKE :search', { search: `%${search}%` });
    }
    
    queryBuilder.orderBy(`busCompany.${sortBy}`, sortOrder);
    
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: data.map(company => ({
        id: company.id,
        company_name: company.company_name,
        image: company.image,
        descriptions: company.descriptions,
        created_at: company.created_at,
        updated_at: company.updated_at,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<BusCompanyResponseDto> {
    const busCompany = await this.busCompanyRepository.findOne({ where: { id } });
    
    if (!busCompany) {
      throw new NotFoundException(`Bus company with ID ${id} not found`);
    }
    
    return {
      id: busCompany.id,
      company_name: busCompany.company_name,
      image: busCompany.image,
      descriptions: busCompany.descriptions,
      created_at: busCompany.created_at,
      updated_at: busCompany.updated_at,
    };
  }

  async update(id: number, updateBusCompanyDto: UpdateBusCompanyDto): Promise<BusCompanyResponseDto> {
    const busCompany = await this.busCompanyRepository.findOne({ where: { id } });
    
    if (!busCompany) {
      throw new NotFoundException(`Bus company with ID ${id} not found`);
    }
    
    Object.assign(busCompany, updateBusCompanyDto);
    const updatedBusCompany = await this.busCompanyRepository.save(busCompany);
    
    return {
      id: updatedBusCompany.id,
      company_name: updatedBusCompany.company_name,
      image: updatedBusCompany.image,
      descriptions: updatedBusCompany.descriptions,
      created_at: updatedBusCompany.created_at,
      updated_at: updatedBusCompany.updated_at,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const busCompany = await this.busCompanyRepository.findOne({ where: { id } });
    
    if (!busCompany) {
      throw new NotFoundException(`Bus company with ID ${id} not found`);
    }
    
    await this.busCompanyRepository.remove(busCompany);
    
    return { message: 'Bus company deleted successfully' };
  }
}
