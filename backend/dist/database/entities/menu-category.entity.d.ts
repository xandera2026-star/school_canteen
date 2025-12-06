import { AuditEntity } from './base.entity';
import { SchoolEntity } from './school.entity';
import { MenuCategoryType } from '../enums';
import { MenuItemEntity } from './menu-item.entity';
export declare class MenuCategoryEntity extends AuditEntity {
    id: string;
    schoolId: string;
    school: SchoolEntity;
    name: string;
    type: MenuCategoryType;
    description?: string;
    items?: MenuItemEntity[];
}
