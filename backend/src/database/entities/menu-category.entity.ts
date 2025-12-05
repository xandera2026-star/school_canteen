import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { MenuCategoryType } from '../enums';
import { MenuItemEntity } from './menu-item.entity';

@Entity({ name: 'menu_categories' })
export class MenuCategoryEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, (school) => school.menuCategories)
  school: SchoolEntity;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MenuCategoryType,
  })
  type: MenuCategoryType;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => MenuItemEntity, (item) => item.category)
  items?: MenuItemEntity[];
}
