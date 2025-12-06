import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { MenuCategoryEntity } from './menu-category.entity';
import { AllergyFlag } from '../enums';
import { OrderItemEntity } from './order-item.entity';
export declare class MenuItemEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    categoryId: string;
    category: MenuCategoryEntity;
    name: string;
    description?: string;
    price: number;
    currency: string;
    nutrition?: Record<string, unknown>;
    allergens: AllergyFlag[];
    availability?: Record<string, unknown> | null;
    version: number;
    imageUrl?: string;
    isActive: boolean;
    orderItems?: OrderItemEntity[];
}
