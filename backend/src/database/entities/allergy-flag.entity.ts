import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { StudentEntity } from './student.entity';
import { AllergyFlag } from '../enums';

@Entity({ name: 'allergy_flags' })
export class AllergyFlagEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'flag_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;

  @Column({ name: 'student_id', type: 'uuid', nullable: true })
  studentId?: string;

  @ManyToOne(() => StudentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student?: StudentEntity;

  @Column({ name: 'flag', type: 'enum', enum: AllergyFlag })
  flag: AllergyFlag;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;
}
