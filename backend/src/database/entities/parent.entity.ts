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

@Entity({ name: 'parents' })
export class ParentEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'parent_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, (school) => school.parents)
  school: SchoolEntity;

  @Column({ name: 'name', type: 'text', nullable: true })
  name?: string;

  @Column({ name: 'mobile', type: 'text' })
  mobile: string;

  @Column({ name: 'email', type: 'text', nullable: true })
  email?: string;

  @Column({ name: 'status', type: 'text', default: 'active' })
  status: string;

  @Column({ name: 'firebase_uid', type: 'text', nullable: true })
  firebaseUid?: string;

  @OneToMany(() => ParentChildEntity, (item) => item.parent)
  children?: ParentChildEntity[];

  @OneToMany(() => OrderEntity, (order) => order.parent)
  orders?: OrderEntity[];
}
