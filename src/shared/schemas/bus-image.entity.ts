import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bus } from './bus.entity';

@Entity('bus_images')
export class BusImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image_url: string;

  @Column({ nullable: false })
  bus_id: number;

  @ManyToOne(() => Bus, bus => bus.busImages)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;
}
