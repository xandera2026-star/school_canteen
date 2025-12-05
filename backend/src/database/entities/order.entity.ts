import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { ParentEntity } from './parent.entity';
import { StudentEntity } from './student.entity';
import { OrderStatus, PaymentStatus } from '../enums';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from './payment.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, (school) => school.orders)
  school: SchoolEntity;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => StudentEntity, (student) => student.orders)
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;

  @Column({ name: 'parent_id', type: 'uuid' })
  parentId: string;

  @ManyToOne(() => ParentEntity, (parent) => parent.orders)
  @JoinColumn({ name: 'parent_id' })
  parent: ParentEntity;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'service_date', type: 'date' })
  serviceDate: string;

  @Column({ name: 'special_instructions', type: 'text', nullable: true })
  specialInstructions?: string;

  @Column({ name: 'cut_off_locked', type: 'boolean', default: false })
  cutOffLocked: boolean;

  @Column({ name: 'total_amount', type: 'numeric', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'currency', type: 'text', default: 'INR' })
  currency: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items?: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments?: PaymentEntity[];
}
