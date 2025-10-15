import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BusCompanyService } from '../services/bus-company.service';
import { CreateBusCompanyDto, UpdateBusCompanyDto, BusCompanyQueryDto } from '../dtos/request/bus-company.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Bus Companies')
@Controller('bus-companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BusCompanyController {
  constructor(private readonly busCompanyService: BusCompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bus company' })
  @ApiResponse({ 
    status: 201, 
    description: 'Bus company successfully created' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  create(@Body() createBusCompanyDto: CreateBusCompanyDto) {
    return this.busCompanyService.create(createBusCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bus companies' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus companies retrieved successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  findAll(@Query() queryDto: BusCompanyQueryDto) {
    return this.busCompanyService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bus company by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Bus company ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus company retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bus company not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.busCompanyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bus company' })
  @ApiParam({ name: 'id', type: 'number', description: 'Bus company ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus company updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bus company not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBusCompanyDto: UpdateBusCompanyDto
  ) {
    return this.busCompanyService.update(id, updateBusCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bus company' })
  @ApiParam({ name: 'id', type: 'number', description: 'Bus company ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bus company deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bus company not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.busCompanyService.remove(id);
  }
}
