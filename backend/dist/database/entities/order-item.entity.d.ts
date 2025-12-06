import { OrderEntity } from './order.entity';
import { MenuItemEntity } from './menu-item.entity';
import { AuditEntity } from './base.entity';
export declare class OrderItemEntity extends AuditEntity {
    id: string;
    orderId: string;
    order: OrderEntity;
    schoolId: string;
    menuItemId: string;
    menuItem: MenuItemEntity;
    nameSnapshot: string;
    unitPrice: number;
    quantity: number;
    preferences: string[];
}
