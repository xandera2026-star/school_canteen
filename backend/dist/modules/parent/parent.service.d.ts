import { Repository } from 'typeorm';
import { MenuQueryDto } from './dto/menu-query.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { IdempotencyKeyEntity, MenuCategoryEntity, MenuItemEntity, OrderEntity, OrderItemEntity, ParentChildEntity, ParentEntity, PaymentEntity } from '../../database/entities';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { OrderStatus, PaymentStatus } from '../../database/enums';
export declare class ParentService {
    private readonly parentRepository;
    private readonly parentChildRepository;
    private readonly menuCategoryRepository;
    private readonly menuItemRepository;
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly paymentRepository;
    private readonly idempotencyRepository;
    private readonly logger;
    constructor(parentRepository: Repository<ParentEntity>, parentChildRepository: Repository<ParentChildEntity>, menuCategoryRepository: Repository<MenuCategoryEntity>, menuItemRepository: Repository<MenuItemEntity>, orderRepository: Repository<OrderEntity>, orderItemRepository: Repository<OrderItemEntity>, paymentRepository: Repository<PaymentEntity>, idempotencyRepository: Repository<IdempotencyKeyEntity>);
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
    fetchMenu(query: MenuQueryDto, user: UserPayload): Promise<{
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
    createOrUpdateOrder(payload: OrderRequestDto, idempotencyKey: string, user: UserPayload): Promise<Record<string, unknown> | {
        data: {
            order_id: string;
            school_id: string;
            student_id: string;
            status: OrderStatus;
            payment_status: PaymentStatus;
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
    listOrders(month: string | undefined, user: UserPayload): Promise<{
        data: ({
            order_id: string;
            school_id: string;
            student_id: string;
            status: OrderStatus;
            payment_status: PaymentStatus;
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
            status: PaymentStatus;
            amount: number;
            transaction_ref: string | undefined;
        };
    }>;
    private toOrderResponse;
    private mapPaymentState;
}
