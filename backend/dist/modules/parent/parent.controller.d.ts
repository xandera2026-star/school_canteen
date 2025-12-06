import { ParentService } from './parent.service';
import { MenuQueryDto } from './dto/menu-query.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';
export declare class ParentController {
    private readonly parentService;
    constructor(parentService: ParentService);
    listStudents(user: UserPayload): Promise<{
        data: {
            student_id: string;
            name: string;
            class: string | undefined;
            section: string | undefined;
            roll_number: string | undefined;
            allergies: import("../../database/enums").AllergyFlag[];
            is_active: boolean;
            photo_url: string | undefined;
        }[];
    }>;
    getMenu(query: MenuQueryDto, user: UserPayload): Promise<{
        data: {
            category_id: string;
            name: string;
            type: import("../../database/enums").MenuCategoryType;
            description: string | undefined;
            items: {
                item_id: string;
                name: string;
                description: string | undefined;
                price: number;
                currency: string;
                nutrition: Record<string, unknown> | undefined;
                allergens: import("../../database/enums").AllergyFlag[];
                availability: Record<string, unknown> | null | undefined;
                image_url: string | undefined;
            }[];
        }[];
        meta: {
            service_date: string;
        };
    }>;
    upsertOrder(idempotencyKey: string, payload: OrderRequestDto, user: UserPayload): Promise<Record<string, unknown> | {
        data: {
            order_id: string;
            school_id: string;
            student_id: string;
            status: import("../../database/enums").OrderStatus;
            payment_status: import("../../database/enums").PaymentStatus;
            service_date: string;
            special_instructions: string | undefined;
            cut_off_locked: boolean;
            total_amount: number;
            currency: string;
            items: {
                menu_item_id: string;
                name: string;
                quantity: number;
                unit_price: number;
                preferences: string[];
            }[];
        } | null;
    }>;
    getOrders(month: string | undefined, user: UserPayload): Promise<{
        data: ({
            order_id: string;
            school_id: string;
            student_id: string;
            status: import("../../database/enums").OrderStatus;
            payment_status: import("../../database/enums").PaymentStatus;
            service_date: string;
            special_instructions: string | undefined;
            cut_off_locked: boolean;
            total_amount: number;
            currency: string;
            items: {
                menu_item_id: string;
                name: string;
                quantity: number;
                unit_price: number;
                preferences: string[];
            }[];
        } | null)[];
    }>;
    recordPayment(payload: PaymentRequestDto, user: UserPayload): Promise<{
        data: {
            payment_id: string;
            order_id: string;
            method: string;
            status: import("../../database/enums").PaymentStatus;
            amount: number;
            transaction_ref: string | undefined;
        };
    }>;
}
