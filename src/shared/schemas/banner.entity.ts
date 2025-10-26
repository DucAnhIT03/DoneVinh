import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  banner_url: string;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}


