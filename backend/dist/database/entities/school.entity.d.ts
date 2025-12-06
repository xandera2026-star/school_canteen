import { AuditEntity } from './base.entity';
import { SchoolSettingsEntity } from './school-settings.entity';
import { ParentEntity } from './parent.entity';
import { StudentEntity } from './student.entity';
import { MenuCategoryEntity } from './menu-category.entity';
import { MenuItemEntity } from './menu-item.entity';
import { OrderEntity } from './order.entity';
export declare class SchoolEntity extends AuditEntity {
    id: string;
    ownerId: string;
    schoolCode: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
    status: string;
    settings?: SchoolSettingsEntity;
    parents?: ParentEntity[];
    students?: StudentEntity[];
    menuCategories?: MenuCategoryEntity[];
    menuItems?: MenuItemEntity[];
    orders?: OrderEntity[];
}
