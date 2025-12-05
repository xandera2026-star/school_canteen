import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { PaymentStatus } from '../enums';
import { OrderEntity } from './order.entity';
import { SchoolEntity } from './school.entity';

@Entity({ name: 'payments' })
export class PaymentEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'method', type: 'text' })
  method: string;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ name: 'amount', type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'transaction_ref', type: 'text', nullable: true })
  transactionRef?: string;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt?: Date;
}
