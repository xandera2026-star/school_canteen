import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { ParentEntity } from './parent.entity';
import { StudentEntity } from './student.entity';
import { OrderStatus, PaymentStatus } from '../enums';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from './payment.entity';
export declare class OrderEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    studentId: string;
    student: StudentEntity;
    parentId: string;
    parent: ParentEntity;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    serviceDate: string;
    specialInstructions?: string;
    cutOffLocked: boolean;
    totalAmount: number;
    currency: string;
    items?: OrderItemEntity[];
    payments?: PaymentEntity[];
}
