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
import { PaymentProviderService } from '../services/payment-provider.service';
import { CreatePaymentProviderDto } from '../dtos/create-payment-provider.dto';
import { UpdatePaymentProviderDto } from '../dtos/update-payment-provider.dto';
import { PaymentProviderQueryDto } from '../dtos/payment-provider-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ProviderType } from '../../../shared/schemas/payment-provider.entity';

@Controller('payment-providers')
export class PaymentProviderController {
  constructor(private readonly paymentProviderService: PaymentProviderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPaymentProviderDto: CreatePaymentProviderDto) {
    return this.paymentProviderService.create(createPaymentProviderDto);
  }

  @Get()
  findAll(@Query() queryDto: PaymentProviderQueryDto) {
    return this.paymentProviderService.findAll(queryDto);
  }

  @Get('active')
  getActiveProviders() {
    return this.paymentProviderService.getActiveProviders();
  }

  @Get('by-revenue')
  getProvidersByRevenue(@Query('limit') limit?: number) {
    return this.paymentProviderService.getProvidersByRevenue(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('statistics/by-type')
  getProviderTypesStatistics() {
    return this.paymentProviderService.getProviderTypesStatistics();
  }

  @Get('type/:providerType')
  findByType(@Param('providerType') providerType: ProviderType) {
    return this.paymentProviderService.findByType(providerType);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentProviderService.findById(id);
  }

  @Get(':id/statistics')
  getProviderStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.paymentProviderService.getProviderStatistics(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentProviderDto: UpdatePaymentProviderDto,
  ) {
    return this.paymentProviderService.update(id, updatePaymentProviderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentProviderService.delete(id);
  }
}




