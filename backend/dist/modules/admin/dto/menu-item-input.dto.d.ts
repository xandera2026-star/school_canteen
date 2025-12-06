import { MenuCategoryType } from './menu-category-input.dto';
declare enum AvailabilityMode {
    DAILY = "daily",
    DATE_RANGE = "date_range",
    WEEKDAYS = "weekdays"
}
declare class AvailabilityDto {
    mode: AvailabilityMode;
    days?: string[];
    start_date?: string;
    end_date?: string;
}
export declare class MenuItemInputDto {
    category_id: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    nutrition?: Record<string, unknown>;
    allergens?: string[];
    availability?: AvailabilityDto;
    image_url?: string;
    is_active?: boolean;
    type_override?: MenuCategoryType;
}
export {};
