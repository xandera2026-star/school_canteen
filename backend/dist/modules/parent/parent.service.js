"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ParentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_request_dto_1 = require("./dto/payment-request.dto");
const entities_1 = require("../../database/entities");
const enums_1 = require("../../database/enums");
let ParentService = ParentService_1 = class ParentService {
    parentRepository;
    parentChildRepository;
    menuCategoryRepository;
    menuItemRepository;
    orderRepository;
    orderItemRepository;
    paymentRepository;
    idempotencyRepository;
    logger = new common_1.Logger(ParentService_1.name);
    constructor(parentRepository, parentChildRepository, menuCategoryRepository, menuItemRepository, orderRepository, orderItemRepository, paymentRepository, idempotencyRepository) {
        this.parentRepository = parentRepository;
        this.parentChildRepository = parentChildRepository;
        this.menuCategoryRepository = menuCategoryRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.idempotencyRepository = idempotencyRepository;
    }
    async listStudents(user) {
        const parent = await this.parentRepository.findOne({
            where: { id: user.sub },
            relations: {
                children: {
                    student: true,
                },
            },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent profile not found');
        }
        const data = parent.children?.map((child) => ({
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
    async fetchMenu(query, user) {
        const schoolId = query.school_id ?? user.schoolId;
        if (!schoolId) {
            throw new common_1.BadRequestException('school_id is required');
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
            items: category.items
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
    async createOrUpdateOrder(payload, idempotencyKey, user) {
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
            throw new common_1.NotFoundException('Parent profile not found');
        }
        const studentLink = await this.parentChildRepository.findOne({
            where: {
                parentId: parent.id,
                studentId: payload.student_id,
            },
        });
        if (!studentLink) {
            throw new common_1.BadRequestException('Student does not belong to this parent');
        }
        const menuItemIds = payload.items.map((item) => item.menu_item_id);
        const menuItems = await this.menuItemRepository.find({
            where: {
                id: (0, typeorm_2.In)(menuItemIds),
                schoolId: parent.schoolId,
                isActive: true,
            },
        });
        if (menuItems.length !== menuItemIds.length) {
            throw new common_1.BadRequestException('Some menu items are invalid or inactive');
        }
        const menuMap = new Map(menuItems.map((item) => [item.id, item]));
        const totalAmount = payload.items.reduce((sum, line) => {
            const menuItem = menuMap.get(line.menu_item_id);
            if (!menuItem) {
                throw new common_1.BadRequestException('Menu item not found for order');
            }
            return sum + Number(menuItem.price) * line.quantity;
        }, 0);
        let order = null;
        if (payload.order_id) {
            order = await this.orderRepository.findOne({
                where: { id: payload.order_id, parentId: parent.id },
                relations: { items: true },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (order.cutOffLocked) {
                throw new common_1.BadRequestException('Order can no longer be modified');
            }
            await this.orderItemRepository.delete({ orderId: order.id });
        }
        else {
            order = this.orderRepository.create({
                schoolId: parent.schoolId,
                studentId: payload.student_id,
                parentId: parent.id,
                status: enums_1.OrderStatus.PENDING,
                paymentStatus: enums_1.PaymentStatus.PENDING,
            });
        }
        order.serviceDate = payload.service_date;
        order.specialInstructions = payload.special_instructions;
        order.totalAmount = totalAmount;
        order.currency = menuItems[0]?.currency ?? 'INR';
        order.items = payload.items.map((line) => {
            const menuItem = menuMap.get(line.menu_item_id);
            if (!menuItem) {
                throw new common_1.BadRequestException('Menu item not found for order');
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
    async listOrders(month, user) {
        const where = { parentId: user.sub };
        if (month) {
            const [year, monthPart] = month.split('-').map((value) => Number(value));
            if (Number.isNaN(year) || Number.isNaN(monthPart)) {
                throw new common_1.BadRequestException('month must be formatted as YYYY-MM');
            }
            const start = new Date(Date.UTC(year, monthPart - 1, 1));
            const end = new Date(Date.UTC(year, monthPart, 0, 23, 59, 59));
            Object.assign(where, {
                serviceDate: (0, typeorm_2.Between)(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)),
            });
        }
        const orders = await this.orderRepository.find({
            where,
            relations: { items: true },
            order: { serviceDate: 'DESC', createdAt: 'DESC' },
        });
        return { data: orders.map((order) => this.toOrderResponse(order)) };
    }
    async recordPayment(payload, user) {
        const order = await this.orderRepository.findOne({
            where: { id: payload.order_id, parentId: user.sub },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const status = this.mapPaymentState(payload.status);
        const payment = this.paymentRepository.create({
            schoolId: order.schoolId,
            orderId: order.id,
            method: payload.method,
            status,
            amount: order.totalAmount,
            transactionRef: payload.transaction_ref,
            paidAt: status === enums_1.PaymentStatus.PAID ? new Date() : undefined,
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
    toOrderResponse(order) {
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
            items: order.items?.map((item) => ({
                menu_item_id: item.menuItemId,
                name: item.nameSnapshot,
                quantity: item.quantity,
                unit_price: Number(item.unitPrice),
                preferences: item.preferences ?? [],
            })) ?? [],
        };
    }
    mapPaymentState(state) {
        switch (state) {
            case payment_request_dto_1.PaymentState.PAID:
                return enums_1.PaymentStatus.PAID;
            case payment_request_dto_1.PaymentState.FAILED:
                return enums_1.PaymentStatus.FAILED;
            default:
                return enums_1.PaymentStatus.PENDING;
        }
    }
};
exports.ParentService = ParentService;
exports.ParentService = ParentService = ParentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ParentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ParentChildEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.MenuCategoryEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.MenuItemEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.OrderEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.OrderItemEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.PaymentEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.IdempotencyKeyEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ParentService);
//# sourceMappingURL=parent.service.js.map