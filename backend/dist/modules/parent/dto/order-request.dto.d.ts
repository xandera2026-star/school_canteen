declare class OrderItemDto {
    menu_item_id: string;
    quantity: number;
    preferences?: string[];
}
export declare class OrderRequestDto {
    order_id?: string;
    student_id: string;
    service_date: string;
    special_instructions?: string;
    items: OrderItemDto[];
}
export {};
