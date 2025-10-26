import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env file manually
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Set environment variables directly as fallback
if (!process.env.MAIL_HOST) {
  process.env.MAIL_HOST = 'smtp.gmail.com';
  process.env.MAIL_PORT = '587';
  process.env.MAIL_SECURE = 'false';
  process.env.MAIL_USER = 'ducanhinformationtechnology@gmail.com';
  process.env.MAIL_PASS = 'yagpsurkvveqatte';
  process.env.MAIL_FROM = 'ducanhinformationtechnology@gmail.com';
  console.log('🔧 Set environment variables directly');
}
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BusCompanyModule } from './modules/bus-company/bus-company.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { BusModule } from './modules/bus/bus.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { BusImageModule } from './modules/bus-image/bus-image.module';
import { RouteModule } from './modules/routes/route.module';
import { PaymentProviderModule } from './modules/payment-provider/payment-provider.module';
import { StationModule } from './modules/station/station.module';
import { BusStationModule } from './modules/bus-station/bus-station.module';
import { UploadModule } from './modules/upload/upload.module';
import { SharedModule } from './shared/shared.module';
import { databaseConfig } from './shared/providers/database.provider';

// Debug environment loading
console.log('🔍 Environment Debug:');
console.log('Current working directory:', process.cwd());
console.log('Environment file path:', path.resolve(process.cwd(), '.env'));
console.log('Environment variables loaded:', {
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS ? '***HIDDEN***' : 'NOT SET'
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), './.env'),
        '.env',
        './.env'
      ],
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    SharedModule,
    AuthModule,
    BusCompanyModule,
    ScheduleModule,
    BusModule,
    TicketModule,
    BusImageModule,
    RouteModule,
    PaymentProviderModule,
    StationModule,
    BusStationModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
