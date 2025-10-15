import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BusCompanyService } from './bus-company.service';
import { BusCompany } from '../entities/bus-company.entity';
import { CreateBusCompanyDto, UpdateBusCompanyDto, BusCompanyQueryDto } from '../dto/bus-company.dto';

describe('BusCompanyService', () => {
  let service: BusCompanyService;
  let busCompanyRepository: Repository<BusCompany>;

  const mockBusCompanyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusCompanyService,
        {
          provide: getRepositoryToken(BusCompany),
          useValue: mockBusCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<BusCompanyService>(BusCompanyService);
    busCompanyRepository = module.get<Repository<BusCompany>>(getRepositoryToken(BusCompany));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bus company', async () => {
      const createDto: CreateBusCompanyDto = {
        company_name: 'Test Bus Company',
        image: 'test-image.jpg',
        descriptions: 'Test descriptions',
      };

      const mockBusCompany = {
        id: 1,
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusCompanyRepository.create.mockReturnValue(mockBusCompany);
      mockBusCompanyRepository.save.mockResolvedValue(mockBusCompany);

      const result = await service.create(createDto);

      expect(busCompanyRepository.create).toHaveBeenCalledWith(createDto);
      expect(busCompanyRepository.save).toHaveBeenCalledWith(mockBusCompany);
      expect(result).toEqual({
        id: 1,
        company_name: 'Test Bus Company',
        image: 'test-image.jpg',
        descriptions: 'Test descriptions',
        created_at: mockBusCompany.created_at,
        updated_at: mockBusCompany.updated_at,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated bus companies', async () => {
      const queryDto: BusCompanyQueryDto = {
        page: 1,
        limit: 10,
        search: 'test',
        sortBy: 'created_at',
        sortOrder: 'DESC',
      };

      const mockBusCompanies = [
        {
          id: 1,
          company_name: 'Test Bus Company 1',
          image: 'test1.jpg',
          descriptions: 'Test 1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          company_name: 'Test Bus Company 2',
          image: 'test2.jpg',
          descriptions: 'Test 2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockBusCompanies, 2]),
      };

      mockBusCompanyRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: mockBusCompanies.map(company => ({
          id: company.id,
          company_name: company.company_name,
          image: company.image,
          descriptions: company.descriptions,
          created_at: company.created_at,
          updated_at: company.updated_at,
        })),
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a bus company by id', async () => {
      const mockBusCompany = {
        id: 1,
        company_name: 'Test Bus Company',
        image: 'test.jpg',
        descriptions: 'Test descriptions',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusCompanyRepository.findOne.mockResolvedValue(mockBusCompany);

      const result = await service.findOne(1);

      expect(busCompanyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({
        id: 1,
        company_name: 'Test Bus Company',
        image: 'test.jpg',
        descriptions: 'Test descriptions',
        created_at: mockBusCompany.created_at,
        updated_at: mockBusCompany.updated_at,
      });
    });

    it('should throw NotFoundException if bus company not found', async () => {
      mockBusCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a bus company', async () => {
      const updateDto: UpdateBusCompanyDto = {
        company_name: 'Updated Bus Company',
        descriptions: 'Updated descriptions',
      };

      const existingBusCompany = {
        id: 1,
        company_name: 'Original Bus Company',
        image: 'original.jpg',
        descriptions: 'Original descriptions',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedBusCompany = {
        ...existingBusCompany,
        ...updateDto,
        updated_at: new Date(),
      };

      mockBusCompanyRepository.findOne.mockResolvedValue(existingBusCompany);
      mockBusCompanyRepository.save.mockResolvedValue(updatedBusCompany);

      const result = await service.update(1, updateDto);

      expect(busCompanyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(busCompanyRepository.save).toHaveBeenCalledWith(updatedBusCompany);
      expect(result).toEqual({
        id: 1,
        company_name: 'Updated Bus Company',
        image: 'original.jpg',
        descriptions: 'Updated descriptions',
        created_at: existingBusCompany.created_at,
        updated_at: updatedBusCompany.updated_at,
      });
    });

    it('should throw NotFoundException if bus company not found', async () => {
      mockBusCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a bus company', async () => {
      const mockBusCompany = {
        id: 1,
        company_name: 'Test Bus Company',
        image: 'test.jpg',
        descriptions: 'Test descriptions',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusCompanyRepository.findOne.mockResolvedValue(mockBusCompany);
      mockBusCompanyRepository.remove.mockResolvedValue(mockBusCompany);

      const result = await service.remove(1);

      expect(busCompanyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(busCompanyRepository.remove).toHaveBeenCalledWith(mockBusCompany);
      expect(result).toEqual({ message: 'Bus company deleted successfully' });
    });

    it('should throw NotFoundException if bus company not found', async () => {
      mockBusCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
