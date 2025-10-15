import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BusCompanyModule } from './modules/bus-company/bus-company.module';
import { databaseConfig } from './shared/providers/database.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    BusCompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
