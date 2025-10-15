import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Bus } from './bus.entity';
import { Ticket } from './ticket.entity';

export enum SeatType {
  LUXURY = 'LUXURY',
  VIP = 'VIP',
  STANDARD = 'STANDARD'
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED'
}

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  bus_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  seat_number: string;

  @Column({ 
    type: 'enum', 
    enum: SeatType, 
    nullable: false 
  })
  seat_type: SeatType;

  @Column({ 
    type: 'enum', 
    enum: SeatStatus, 
    default: SeatStatus.AVAILABLE 
  })
  status: SeatStatus;

  @Column({ type: 'double', nullable: false, default: 0 })
  price_for_seat_type: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Bus, bus => bus.seats)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @OneToMany(() => Ticket, ticket => ticket.seat)
  tickets: Ticket[];
}
