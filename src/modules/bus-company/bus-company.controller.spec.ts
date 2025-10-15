import { Test, TestingModule } from '@nestjs/testing';
import { BusCompanyController } from './bus-company.controller';
import { BusCompanyService } from './bus-company.service';
import { CreateBusCompanyDto, UpdateBusCompanyDto, BusCompanyQueryDto } from '../dto/bus-company.dto';

describe('BusCompanyController', () => {
  let controller: BusCompanyController;
  let busCompanyService: BusCompanyService;

  const mockBusCompanyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusCompanyController],
      providers: [
        {
          provide: BusCompanyService,
          useValue: mockBusCompanyService,
        },
      ],
    }).compile();

    controller = module.get<BusCompanyController>(BusCompanyController);
    busCompanyService = module.get<BusCompanyService>(BusCompanyService);
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

      const expectedResult = {
        id: 1,
        company_name: 'Test Bus Company',
        image: 'test-image.jpg',
        descriptions: 'Test descriptions',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusCompanyService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(busCompanyService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
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

      const expectedResult = {
        data: [
          {
            id: 1,
            company_name: 'Test Bus Company 1',
            image: 'test1.jpg',
            descriptions: 'Test 1',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockBusCompanyService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(queryDto);

      expect(busCompanyService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a bus company by id', async () => {
      const expectedResult = {
        id: 1,
        company_name: 'Test Bus Company',
        image: 'test.jpg',
        descriptions: 'Test descriptions',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusCompanyService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(busCompanyService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a bus company', async () => {
      const updateDto: UpdateBusCompanyDto = {
        company_name: 'Updated Bus Company',
        descriptions: 'Updated descriptions',
      };

      const expectedResult = {
        id: 1,
        company_name: 'Updated Bus Company',
        image: 'test.jpg',
        descriptions: 'Updated descriptions',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusCompanyService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateDto);

      expect(busCompanyService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a bus company', async () => {
      const expectedResult = { message: 'Bus company deleted successfully' };

      mockBusCompanyService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(1);

      expect(busCompanyService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
