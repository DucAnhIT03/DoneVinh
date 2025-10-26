import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BusImageService } from '../services/bus-image.service';
import { CreateBusImageDto } from '../dtos/create-bus-image.dto';
import { UpdateBusImageDto } from '../dtos/update-bus-image.dto';
import { BusImageQueryDto } from '../dtos/bus-image-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('bus-images')
export class BusImageController {
  constructor(private readonly busImageService: BusImageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBusImageDto: CreateBusImageDto) {
    return this.busImageService.create(createBusImageDto);
  }

  @Get()
  findAll(@Query() queryDto: BusImageQueryDto) {
    return this.busImageService.findAll(queryDto);
  }

  @Get('bus/:busId')
  findByBusId(@Param('busId', ParseIntPipe) busId: number) {
    return this.busImageService.findByBusId(busId);
  }

  @Get('bus/:busId/statistics')
  getBusImageStatistics(@Param('busId', ParseIntPipe) busId: number) {
    return this.busImageService.getBusImageStatistics(busId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.busImageService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusImageDto: UpdateBusImageDto,
  ) {
    return this.busImageService.update(id, updateBusImageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.busImageService.delete(id);
  }
}




