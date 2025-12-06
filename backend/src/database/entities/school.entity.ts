import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolSettingsEntity } from './school-settings.entity';
import { ParentEntity } from './parent.entity';
import { StudentEntity } from './student.entity';
import { MenuCategoryEntity } from './menu-category.entity';
import { MenuItemEntity } from './menu-item.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'schools' })
export class SchoolEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'school_id' })
  id: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({ name: 'school_code', type: 'text', unique: true })
  schoolCode: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'address_line1', type: 'text' })
  addressLine1: string;

  @Column({ name: 'address_line2', type: 'text', nullable: true })
  addressLine2?: string;

  @Column({ name: 'city', type: 'text', nullable: true })
  city?: string;

  @Column({ name: 'state', type: 'text', nullable: true })
  state?: string;

  @Column({ name: 'postal_code', type: 'text', nullable: true })
  postalCode?: string;

  @Column({ name: 'country', type: 'text', default: 'IN' })
  country: string;

  @Column({ name: 'status', type: 'text', default: 'trial' })
  status: string;

  @OneToOne(() => SchoolSettingsEntity, (settings) => settings.school)
  settings?: SchoolSettingsEntity;

  @OneToMany(() => ParentEntity, (parent) => parent.school)
  parents?: ParentEntity[];

  @OneToMany(() => StudentEntity, (student) => student.school)
  students?: StudentEntity[];

  @OneToMany(() => MenuCategoryEntity, (category) => category.school)
  menuCategories?: MenuCategoryEntity[];

  @OneToMany(() => MenuItemEntity, (item) => item.school)
  menuItems?: MenuItemEntity[];

  @OneToMany(() => OrderEntity, (order) => order.school)
  orders?: OrderEntity[];
}
