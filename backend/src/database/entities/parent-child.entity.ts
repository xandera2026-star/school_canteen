import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ParentEntity } from './parent.entity';
import { StudentEntity } from './student.entity';
import { SchoolEntity } from './school.entity';

@Entity({ name: 'parent_children' })
export class ParentChildEntity {
  @PrimaryColumn({ name: 'parent_id', type: 'uuid' })
  parentId: string;

  @PrimaryColumn({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @Column({ name: 'relationship', type: 'text', nullable: true })
  relationship?: string;

  @ManyToOne(() => ParentEntity, (parent) => parent.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: ParentEntity;

  @ManyToOne(() => StudentEntity, (student) => student.parents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;

  @ManyToOne(() => SchoolEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;
}
