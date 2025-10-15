import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Seat } from './seat.entity';
import { Payment } from './payment.entity';

export enum SeatType {
  LUXURY = 'LUXURY',
  VIP = 'VIP',
  STANDARD = 'STANDARD'
}

export enum TicketStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED'
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  schedule_id: number;

  @Column({ nullable: false })
  seat_id: number;

  @Column({ type: 'datetime', nullable: false })
  departure_time: Date;

  @Column({ type: 'datetime', nullable: false })
  arrival_time: Date;

  @Column({ 
    type: 'enum', 
    enum: SeatType, 
    nullable: false 
  })
  seat_type: SeatType;

  @Column({ type: 'double', nullable: false })
  price: number;

  @Column({ 
    type: 'enum', 
    enum: TicketStatus, 
    default: TicketStatus.BOOKED 
  })
  status: TicketStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Schedule, schedule => schedule.tickets)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @ManyToOne(() => Seat, seat => seat.tickets)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @OneToMany(() => Payment, payment => payment.ticket)
  payments: Payment[];
}
