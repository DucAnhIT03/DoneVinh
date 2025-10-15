import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from './station.entity';
import { Bus } from './bus.entity';

@Entity('bus_station')
export class BusStation {
  @PrimaryColumn({ type: 'int' })
  station_id: number;

  @PrimaryColumn({ type: 'int' })
  bus_id: number;

  @ManyToOne(() => Station, station => station.id)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @ManyToOne(() => Bus, bus => bus.id)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;
}
