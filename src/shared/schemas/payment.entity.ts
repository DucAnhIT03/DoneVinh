import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentProvider } from './payment-provider.entity';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  ONLINE = 'ONLINE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  payment_provider_id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  ticket_id: number;

  @Column({ 
    type: 'enum', 
    enum: PaymentMethod, 
    nullable: false 
  })
  payment_method: PaymentMethod;

  @Column({ type: 'double', nullable: false })
  amount: number;

  @Column({ 
    type: 'enum', 
    enum: PaymentStatus, 
    default: PaymentStatus.PENDING 
  })
  status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => PaymentProvider, paymentProvider => paymentProvider.payments)
  @JoinColumn({ name: 'payment_provider_id' })
  paymentProvider: PaymentProvider;

  @ManyToOne(() => User, user => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Ticket, ticket => ticket.payments)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;
}
