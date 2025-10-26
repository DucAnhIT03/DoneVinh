import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Route } from './route.entity';
import { Bus } from './bus.entity';
import { Ticket } from './ticket.entity';

export enum ScheduleStatus {
  AVAILABLE = 'AVAILABLE',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'route_id' })
  routeId: number;

  @Column({ name: 'bus_id' })
  busId: number;

  @Column({ name: 'departure_time', type: 'datetime' })
  departureTime: Date;

  @Column({ name: 'arrival_time', type: 'datetime' })
  arrivalTime: Date;

  @Column({ name: 'available_seat' })
  availableSeat: number;

  @Column({ name: 'total_seats' })
  totalSeats: number;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.AVAILABLE,
  })
  status: ScheduleStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Route, (route) => route.schedules)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Bus, (bus) => bus.schedules)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @OneToMany(() => Ticket, (ticket) => ticket.schedule)
  tickets: Ticket[];
}