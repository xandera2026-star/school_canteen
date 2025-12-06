import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { MenuQueryDto } from './dto/menu-query.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { PaymentRequestDto, PaymentState } from './dto/payment-request.dto';
import {
  IdempotencyKeyEntity,
  MenuCategoryEntity,
  MenuItemEntity,
  OrderEntity,
  OrderItemEntity,
  ParentChildEntity,
  ParentEntity,
  PaymentEntity,
} from '../../database/entities';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { OrderStatus, PaymentStatus } from '../../database/enums';

@Injectable()
export class ParentService {
  private readonly logger = new Logger(ParentService.name);

  constructor(
    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
    @InjectRepository(ParentChildEntity)
    private readonly parentChildRepository: Repository<ParentChildEntity>,
    @InjectRepository(MenuCategoryEntity)
    private readonly menuCategoryRepository: Repository<MenuCategoryEntity>,
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItemEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(IdempotencyKeyEntity)
    private readonly idempotencyRepository: Repository<IdempotencyKeyEntity>,
  ) {}

  async listStudents(user: UserPayload) {
    const parent = await this.parentRepository.findOne({
      where: { id: user.sub },
      relations: {
        children: {
          student: true,
        },
      },
    });
    if (!parent) {
      throw new NotFoundException('Parent profile not found');
    }

    const data =
      parent.children?.map((child) => ({
        student_id: child.student.id,
        name: child.student.name,
        class: child.student.className,
        section: child.student.section,
        roll_number: child.student.rollNumber,
        allergies: child.student.allergyFlags ?? [],
        is_active: child.student.isActive,
        photo_url: child.student.photoUrl,
      })) ?? [];

    return { data };
  }

  async fetchMenu(query: MenuQueryDto, user: UserPayload) {
    const schoolId = query.school_id ?? user.schoolId;
    if (!schoolId) {
      throw new BadRequestException('school_id is required');
    }

    const categories = await this.menuCategoryRepository.find({
      where: { schoolId },
      relations: { items: true },
      order: { name: 'ASC' },
    });

    const data = categories.map((category) => ({
      category_id: category.id,
      name: category.name,
      type: category.type,
      description: category.description,
      items:
        category.items
          ?.filter((item) => item.isActive)
          .map((item) => ({
            item_id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            currency: item.currency,
            nutrition: item.nutrition,
            allergens: item.allergens ?? [],
            availability: item.availability,
            image_url: item.imageUrl,
          })) ?? [],
    }));

    return { data, meta: { service_date: query.service_date } };
  }

  async createOrUpdateOrder(
    payload: OrderRequestDto,
    idempotencyKey: string,
    user: UserPayload,
  ) {
    const existingResponse = await this.idempotencyRepository.findOne({
      where: { key: idempotencyKey },
    });
    if (existingResponse?.responseBody) {
      this.logger.debug(`Replaying idempotent response for ${idempotencyKey}`);
      return existingResponse.responseBody;
    }

    const parent = await this.parentRepository.findOne({
      where: { id: user.sub },
    });
    if (!parent) {
      throw new NotFoundException('Parent profile not found');
    }

    const studentLink = await this.parentChildRepository.findOne({
      where: {
        parentId: parent.id,
        studentId: payload.student_id,
      },
    });
    if (!studentLink) {
      throw new BadRequestException('Student does not belong to this parent');
    }

    const menuItemIds = payload.items.map((item) => item.menu_item_id);
    const menuItems = await this.menuItemRepository.find({
      where: {
        id: In(menuItemIds),
        schoolId: parent.schoolId,
        isActive: true,
      },
    });
    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('Some menu items are invalid or inactive');
    }

    const menuMap = new Map(menuItems.map((item) => [item.id, item]));
    const totalAmount = payload.items.reduce((sum, line) => {
      const menuItem = menuMap.get(line.menu_item_id);
      if (!menuItem) {
        throw new BadRequestException('Menu item not found for order');
      }
      return sum + Number(menuItem.price) * line.quantity;
    }, 0);

    let order: OrderEntity | null = null;
    if (payload.order_id) {
      order = await this.orderRepository.findOne({
        where: { id: payload.order_id, parentId: parent.id },
        relations: { items: true },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (order.cutOffLocked) {
        throw new BadRequestException('Order can no longer be modified');
      }
      await this.orderItemRepository.delete({ orderId: order.id });
    } else {
      order = this.orderRepository.create({
        schoolId: parent.schoolId,
        studentId: payload.student_id,
        parentId: parent.id,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });
    }

    order.serviceDate = payload.service_date;
    order.specialInstructions = payload.special_instructions;
    order.totalAmount = totalAmount;
    order.currency = menuItems[0]?.currency ?? 'INR';
    order.items = payload.items.map((line) => {
      const menuItem = menuMap.get(line.menu_item_id);
      if (!menuItem) {
        throw new BadRequestException('Menu item not found for order');
      }
      return this.orderItemRepository.create({
        schoolId: parent.schoolId,
        menuItemId: menuItem.id,
        nameSnapshot: menuItem.name,
        unitPrice: menuItem.price,
        quantity: line.quantity,
        preferences: line.preferences ?? [],
      });
    });

    await this.orderRepository.save(order);
    const savedOrder = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: { items: true },
    });
    const response = { data: this.toOrderResponse(savedOrder) };

    await this.idempotencyRepository.save({
      key: idempotencyKey,
      schoolId: parent.schoolId,
      parentId: parent.id,
      responseCode: 201,
      responseBody: response,
    });

    return response;
  }

  async listOrders(month: string | undefined, user: UserPayload) {
    const where = { parentId: user.sub };
    if (month) {
      const [year, monthPart] = month.split('-').map((value) => Number(value));
      if (Number.isNaN(year) || Number.isNaN(monthPart)) {
        throw new BadRequestException('month must be formatted as YYYY-MM');
      }
      const start = new Date(Date.UTC(year, monthPart - 1, 1));
      const end = new Date(Date.UTC(year, monthPart, 0, 23, 59, 59));
      Object.assign(where, {
        serviceDate: Between(
          start.toISOString().slice(0, 10),
          end.toISOString().slice(0, 10),
        ),
      });
    }

    const orders = await this.orderRepository.find({
      where,
      relations: { items: true },
      order: { serviceDate: 'DESC', createdAt: 'DESC' },
    });

    return { data: orders.map((order) => this.toOrderResponse(order)) };
  }

  async recordPayment(payload: PaymentRequestDto, user: UserPayload) {
    const order = await this.orderRepository.findOne({
      where: { id: payload.order_id, parentId: user.sub },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const status = this.mapPaymentState(payload.status);
    const payment = this.paymentRepository.create({
      schoolId: order.schoolId,
      orderId: order.id,
      method: payload.method,
      status,
      amount: order.totalAmount,
      transactionRef: payload.transaction_ref,
      paidAt: status === PaymentStatus.PAID ? new Date() : undefined,
    });
    await this.paymentRepository.save(payment);

    order.paymentStatus = status;
    await this.orderRepository.save(order);

    return {
      data: {
        payment_id: payment.id,
        order_id: payment.orderId,
        method: payment.method,
        status: payment.status,
        amount: Number(payment.amount),
        transaction_ref: payment.transactionRef,
      },
    };
  }

  private toOrderResponse(order: OrderEntity | null) {
    if (!order) {
      return null;
    }
    return {
      order_id: order.id,
      school_id: order.schoolId,
      student_id: order.studentId,
      status: order.status,
      payment_status: order.paymentStatus,
      service_date: order.serviceDate,
      special_instructions: order.specialInstructions,
      cut_off_locked: order.cutOffLocked,
      total_amount: Number(order.totalAmount),
      currency: order.currency,
      items:
        order.items?.map((item) => ({
          menu_item_id: item.menuItemId,
          name: item.nameSnapshot,
          quantity: item.quantity,
          unit_price: Number(item.unitPrice),
          preferences: item.preferences ?? [],
        })) ?? [],
    };
  }

  private mapPaymentState(state?: PaymentState): PaymentStatus {
    switch (state) {
      case PaymentState.PAID:
        return PaymentStatus.PAID;
      case PaymentState.FAILED:
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }
}
