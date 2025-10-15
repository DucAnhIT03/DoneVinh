import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Route } from './route.entity';

@Entity('cancellation_policies')
export class CancellationPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  descriptions: string;

  @Column({ type: 'int' })
  cancellation_time_limit: number;

  @Column({ type: 'int' })
  refund_percentage: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;

  @Column({ type: 'int' })
  route_id: number;

  @ManyToOne(() => Route, route => route.id)
  @JoinColumn({ name: 'route_id' })
  route: Route;
}
