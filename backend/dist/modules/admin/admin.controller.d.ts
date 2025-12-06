import { AdminService } from './admin.service';
import { MenuCategoryInputDto } from './dto/menu-category-input.dto';
import { MenuItemInputDto } from './dto/menu-item-input.dto';
import { ThemeSettingsDto } from './dto/theme-settings.dto';
import { CutoffSettingsDto } from './dto/cutoff-settings.dto';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    importStudents(file: unknown, user: UserPayload): Promise<{
        data: {
            import_id: `${string}-${string}-${string}-${string}-${string}`;
            processed: number;
            students_created: number;
            students_updated: number;
            parents_created: number;
        };
    }>;
    listCategories(user: UserPayload): Promise<{
        data: {
            category_id: string;
            name: string;
            type: import("../../database/enums").MenuCategoryType;
            description: string | undefined;
        }[];
    }>;
    createCategory(payload: MenuCategoryInputDto, user: UserPayload): Promise<{
        data: {
            name: string;
            type: import("./dto/menu-category-input.dto").MenuCategoryType;
            description?: string;
            category_id: string;
        };
    }>;
    listMenuItems(user: UserPayload): Promise<{
        data: {
            item_id: string;
            name: string;
            description: string | undefined;
            price: number;
            currency: string;
            category_id: string;
            category_name: string;
            allergens: import("../../database/enums").AllergyFlag[];
            is_active: boolean;
            availability: Record<string, unknown> | null | undefined;
            image_url: string | undefined;
        }[];
    }>;
    createMenuItem(payload: MenuItemInputDto, user: UserPayload): Promise<{
        data: {
            item_id: string;
        };
    }>;
    updateTheme(payload: ThemeSettingsDto, user: UserPayload): Promise<{
        data: ThemeSettingsDto;
    }>;
    updateCutoff(payload: CutoffSettingsDto, user: UserPayload): Promise<{
        data: CutoffSettingsDto;
    }>;
    dashboard(date: string | undefined, user: UserPayload): Promise<{
        data: {
            date: string;
            orders_today: number;
            gpay_total: number;
            cash_total: number;
            top_items: {
                name: string;
                count: number;
            }[];
            missing_students: {
                student_id: string;
                name: string;
                class: string | undefined;
                section: string | undefined;
            }[];
        };
    }>;
}
