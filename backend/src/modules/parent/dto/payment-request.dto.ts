import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum PaymentMethod {
  GPAY_UPI = 'gpay_upi',
  CASH = 'cash',
}

export enum PaymentState {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export class PaymentRequestDto {
  @IsUUID()
  order_id: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  transaction_ref?: string;

  @IsOptional()
  @IsEnum(PaymentState)
  status?: PaymentState;
}
