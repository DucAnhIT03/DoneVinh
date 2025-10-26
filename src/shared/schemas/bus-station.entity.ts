import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from './station.entity';

@Entity('bus_stations')
export class BusStation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stationId: number;

  @Column()
  busId: number;

  @Column('datetime')
  arrivalTime: Date;

  @Column('datetime')
  departureTime: Date;

  @Column({ default: 0 })
  sequence: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: '' })
  platform: string;

  @Column({ default: '' })
  gate: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: '' })
  notes: string;

  @Column({ default: 0 })
  availableSeats: number;

  @Column({ default: 0 })
  totalSeats: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'stationId' })
  station: Station;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



