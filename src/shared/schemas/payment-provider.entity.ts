import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';

export enum ProviderType {
  CARD = 'CARD',
  E_WALLET = 'E-WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  QR_CODE = 'QR_CODE'
}

@Entity('payment_providers')
export class PaymentProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  provider_name: string;

  @Column({ 
    type: 'enum', 
    enum: ProviderType, 
    nullable: false 
  })
  provider_type: ProviderType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  api_endpoint: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Payment, payment => payment.paymentProvider)
  payments: Payment[];
}
