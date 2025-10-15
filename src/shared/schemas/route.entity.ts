import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Station } from './station.entity';
import { Schedule } from './schedule.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  departure_station_id: number;

  @Column({ nullable: false })
  arrival_station_id: number;

  @Column({ type: 'double', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @Column({ type: 'int', nullable: false })
  distance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Station, station => station.departureRoutes)
  @JoinColumn({ name: 'departure_station_id' })
  departureStation: Station;

  @ManyToOne(() => Station, station => station.arrivalRoutes)
  @JoinColumn({ name: 'arrival_station_id' })
  arrivalStation: Station;

  @OneToMany(() => Schedule, schedule => schedule.route)
  schedules: Schedule[];
}
