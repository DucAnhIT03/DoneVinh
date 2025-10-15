import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BusCompany } from './bus-company.entity';
import { BusImage } from './bus-image.entity';
import { Seat } from './seat.entity';
import { Schedule } from './schedule.entity';
import { BusReview } from './bus-review.entity';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  descriptions: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  license_plate: string;

  @Column({ type: 'int', nullable: false })
  capacity: number;

  @Column({ nullable: false })
  company_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => BusCompany, company => company.buses)
  @JoinColumn({ name: 'company_id' })
  company: BusCompany;

  @OneToMany(() => BusImage, busImage => busImage.bus)
  busImages: BusImage[];

  @OneToMany(() => Seat, seat => seat.bus)
  seats: Seat[];

  @OneToMany(() => Schedule, schedule => schedule.bus)
  schedules: Schedule[];

  @OneToMany(() => BusReview, busReview => busReview.bus)
  busReviews: BusReview[];
}
