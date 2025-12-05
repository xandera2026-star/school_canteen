import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { MenuQueryDto } from './dto/menu-query.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';

@Controller({ path: 'parent', version: '1' })
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('students')
  listStudents() {
    return this.parentService.listStudents();
  }

  @Get('menu')
  getMenu(@Query() query: MenuQueryDto) {
    return this.parentService.fetchMenu(query);
  }

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  upsertOrder(
    @Headers('idempotency-key') idempotencyKey: string,
    @Body() payload: OrderRequestDto,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    return this.parentService.createOrUpdateOrder(payload, idempotencyKey);
  }

  @Get('orders')
  getOrders(@Query('month') month?: string) {
    return this.parentService.listOrders(month);
  }

  @Post('payments')
  recordPayment(@Body() payload: PaymentRequestDto) {
    return this.parentService.recordPayment(payload);
  }
}
