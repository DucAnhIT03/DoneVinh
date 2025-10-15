import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Route } from './route.entity';
import { Bus } from './bus.entity';
import { Ticket } from './ticket.entity';

export enum ScheduleStatus {
  AVAILABLE = 'AVAILABLE',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED'
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  route_id: number;

  @Column({ nullable: false })
  bus_id: number;

  @Column({ type: 'datetime', nullable: false })
  departure_time: Date;

  @Column({ type: 'datetime', nullable: false })
  arrival_time: Date;

  @Column({ type: 'int', nullable: false })
  available_seat: number;

  @Column({ type: 'int', nullable: false })
  total_seats: number;

  @Column({ 
    type: 'enum', 
    enum: ScheduleStatus, 
    default: ScheduleStatus.AVAILABLE 
  })
  status: ScheduleStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Route, route => route.schedules)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Bus, bus => bus.schedules)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @OneToMany(() => Ticket, ticket => ticket.schedule)
  tickets: Ticket[];
}
