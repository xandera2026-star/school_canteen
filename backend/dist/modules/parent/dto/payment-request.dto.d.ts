export declare enum PaymentMethod {
    GPAY_UPI = "gpay_upi",
    CASH = "cash"
}
export declare enum PaymentState {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export declare class PaymentRequestDto {
    order_id: string;
    method: PaymentMethod;
    transaction_ref?: string;
    status?: PaymentState;
}
