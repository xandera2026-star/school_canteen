import { AuditEntity } from './base.entity';
import { PaymentStatus } from '../enums';
import { OrderEntity } from './order.entity';
import { SchoolEntity } from './school.entity';
export declare class PaymentEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    orderId: string;
    order: OrderEntity;
    method: string;
    status: PaymentStatus;
    amount: number;
    transactionRef?: string;
    paidAt?: Date;
}
