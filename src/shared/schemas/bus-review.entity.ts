import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Bus } from './bus.entity';

@Entity('bus_reviews')
export class BusReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  bus_id: number;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  review: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.busReviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bus, bus => bus.busReviews)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;
}
