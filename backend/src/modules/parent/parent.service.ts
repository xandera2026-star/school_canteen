import { Injectable } from '@nestjs/common';
import { MenuQueryDto } from './dto/menu-query.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';

@Injectable()
export class ParentService {
  listStudents() {
    return {
      data: [
        {
          student_id: '00000000-0000-0000-0000-000000000001',
          name: 'Aarav Krishnan',
          class: 'IX',
          section: 'A',
          roll_number: 'SVSS-101',
          allergies: ['nuts'],
          is_active: true,
        },
      ],
    };
  }

  fetchMenu(params: MenuQueryDto) {
    return {
      data: [
        {
          category_id: 'cat-veg',
          name: 'Veg',
          type: 'veg',
          items: [
            {
              item_id: 'item-1',
              name: 'Veg Biriyani',
              price: 80,
              currency: 'INR',
              nutrition: { calories: 320 },
              allergens: ['nuts'],
              availability: { mode: 'daily' },
              image_url: 'https://cdn.example.com/menu/veg-biriyani.jpg',
            },
          ],
        },
      ],
      meta: params,
    };
  }

  createOrUpdateOrder(payload: OrderRequestDto, idempotencyKey?: string) {
    return {
      data: {
        order_id: payload.order_id ?? 'order-placeholder',
        status: 'pending',
        payment_status: 'pending',
        cut_off_locked: false,
        idempotency_key: idempotencyKey,
      },
    };
  }

  listOrders(month?: string) {
    return {
      data: [
        {
          order_id: 'order-placeholder',
          service_date: '2025-01-02',
          status: 'confirmed',
          payment_status: 'paid',
          total_amount: 120,
          currency: 'INR',
        },
      ],
      month,
    };
  }

  recordPayment(payload: PaymentRequestDto) {
    return {
      data: {
        payment_id: 'pay-placeholder',
        order_id: payload.order_id,
        method: payload.method,
        status: payload.status ?? 'pending',
        amount: 120,
      },
    };
  }
}
