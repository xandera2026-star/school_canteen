import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { ParentChildEntity } from './parent-child.entity';
import { OrderEntity } from './order.entity';
import { AllergyFlag } from '../enums';

@Entity({ name: 'students' })
export class StudentEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'student_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, (school) => school.students)
  school: SchoolEntity;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'roll_number', type: 'text', nullable: true })
  rollNumber?: string;

  @Column({ name: 'class_name', type: 'text', nullable: true })
  className?: string;

  @Column({ name: 'section', type: 'text', nullable: true })
  section?: string;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    name: 'allergy_flags',
    type: 'enum',
    enum: AllergyFlag,
    array: true,
    default: '{}',
  })
  allergyFlags: AllergyFlag[];

  @OneToMany(() => ParentChildEntity, (item) => item.student)
  parents?: ParentChildEntity[];

  @OneToMany(() => OrderEntity, (order) => order.student)
  orders?: OrderEntity[];
}
