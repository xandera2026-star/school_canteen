import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { ParentChildEntity } from './parent-child.entity';
import { OrderEntity } from './order.entity';
import { AllergyFlag } from '../enums';
export declare class StudentEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    name: string;
    rollNumber?: string;
    className?: string;
    section?: string;
    photoUrl?: string;
    isActive: boolean;
    allergyFlags: AllergyFlag[];
    parents?: ParentChildEntity[];
    orders?: OrderEntity[];
}
