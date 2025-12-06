import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { ParentChildEntity } from './parent-child.entity';
import { OrderEntity } from './order.entity';
export declare class ParentEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    name?: string;
    mobile: string;
    email?: string;
    status: string;
    firebaseUid?: string;
    children?: ParentChildEntity[];
    orders?: OrderEntity[];
}
