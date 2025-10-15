import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../schemas/user.entity';
import { Role } from '../schemas/role.entity';
import { UserRole } from '../schemas/user-role.entity';
import { BusCompany } from '../schemas/bus-company.entity';
import { Bus } from '../schemas/bus.entity';
import { BusImage } from '../schemas/bus-image.entity';
import { Seat } from '../schemas/seat.entity';
import { BusReview } from '../schemas/bus-review.entity';
import { Schedule } from '../schemas/schedule.entity';
import { Route } from '../schemas/route.entity';
import { Station } from '../schemas/station.entity';
import { Payment } from '../schemas/payment.entity';
import { PaymentProvider } from '../schemas/payment-provider.entity';
import { Ticket } from '../schemas/ticket.entity';
import { Banner } from '../schemas/banner.entity';
import { CancellationPolicy } from '../schemas/cancellation-policy.entity';
import { BusStation } from '../schemas/bus-station.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'bus_booking',
  entities: [
    User,
    Role,
    UserRole,
    BusCompany,
    Bus,
    BusImage,
    Seat,
    BusReview,
    Schedule,
    Route,
    Station,
    Payment,
    PaymentProvider,
    Ticket,
    Banner,
    CancellationPolicy,
    BusStation,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
};

