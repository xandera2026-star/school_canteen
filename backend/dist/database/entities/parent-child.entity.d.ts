import { ParentEntity } from './parent.entity';
import { StudentEntity } from './student.entity';
import { SchoolEntity } from './school.entity';
export declare class ParentChildEntity {
    parentId: string;
    studentId: string;
    schoolId: string;
    relationship?: string;
    parent: ParentEntity;
    student: StudentEntity;
    school: SchoolEntity;
}
