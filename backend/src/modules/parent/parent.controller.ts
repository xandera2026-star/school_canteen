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
  UseGuards,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { MenuQueryDto } from './dto/menu-query.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'parent', version: '1' })
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('students')
  listStudents(@CurrentUser() user: UserPayload) {
    return this.parentService.listStudents(user);
  }

  @Get('menu')
  getMenu(@Query() query: MenuQueryDto, @CurrentUser() user: UserPayload) {
    return this.parentService.fetchMenu(query, user);
  }

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  upsertOrder(
    @Headers('idempotency-key') idempotencyKey: string,
    @Body() payload: OrderRequestDto,
    @CurrentUser() user: UserPayload,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    return this.parentService.createOrUpdateOrder(
      payload,
      idempotencyKey,
      user,
    );
  }

  @Get('orders')
  getOrders(
    @Query('month') month: string | undefined,
    @CurrentUser() user: UserPayload,
  ) {
    return this.parentService.listOrders(month, user);
  }

  @Post('payments')
  recordPayment(
    @Body() payload: PaymentRequestDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.parentService.recordPayment(payload, user);
  }
}
