import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { StudentEntity } from './student.entity';
import { AllergyFlag } from '../enums';
export declare class AllergyFlagEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    studentId?: string;
    student?: StudentEntity;
    flag: AllergyFlag;
    notes?: string;
}
