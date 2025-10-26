import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Route } from './route.entity';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  email: string;

  @Column('json', { default: '[]' })
  facilities: string[];

  @Column({ default: '' })
  imageUrl: string;

  @Column({ default: '' })
  image: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: 0 })
  capacity: number;

  @Column({ default: 0 })
  currentOccupancy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Route, route => route.departureStation)
  departureRoutes: Route[];

  @OneToMany(() => Route, route => route.arrivalStation)
  arrivalRoutes: Route[];
}
