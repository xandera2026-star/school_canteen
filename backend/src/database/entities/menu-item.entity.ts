import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { MenuCategoryEntity } from './menu-category.entity';
import { AllergyFlag } from '../enums';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'menu_items' })
export class MenuItemEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'item_id' })
  id: string;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @ManyToOne(() => SchoolEntity, (school) => school.menuItems)
  school: SchoolEntity;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => MenuCategoryEntity, (category) => category.items, {
    eager: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: MenuCategoryEntity;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'currency', type: 'text', default: 'INR' })
  currency: string;

  @Column({ name: 'nutrition', type: 'jsonb', nullable: true })
  nutrition?: Record<string, unknown>;

  @Column({
    name: 'allergens',
    type: 'enum',
    enum: AllergyFlag,
    array: true,
    default: '{}',
  })
  allergens: AllergyFlag[];

  @Column({ name: 'availability', type: 'jsonb', nullable: true })
  availability?: Record<string, unknown>;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => OrderItemEntity, (item) => item.menuItem)
  orderItems?: OrderItemEntity[];
}
