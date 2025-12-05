import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { MenuItemEntity } from './menu-item.entity';
import { AuditEntity } from './base.entity';

@Entity({ name: 'order_items' })
export class OrderItemEntity extends AuditEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'order_item_id' })
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'school_id', type: 'uuid' })
  schoolId: string;

  @Column({ name: 'menu_item_id', type: 'uuid' })
  menuItemId: string;

  @ManyToOne(() => MenuItemEntity, (menuItem) => menuItem.orderItems)
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItemEntity;

  @Column({ name: 'name_snapshot', type: 'text' })
  nameSnapshot: string;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'preferences', type: 'text', array: true, default: '{}' })
  preferences: string[];
}
