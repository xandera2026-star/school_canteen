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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentController = void 0;
const common_1 = require("@nestjs/common");
const parent_service_1 = require("./parent.service");
const menu_query_dto_1 = require("./dto/menu-query.dto");
const order_request_dto_1 = require("./dto/order-request.dto");
const payment_request_dto_1 = require("./dto/payment-request.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ParentController = class ParentController {
    parentService;
    constructor(parentService) {
        this.parentService = parentService;
    }
    listStudents(user) {
        return this.parentService.listStudents(user);
    }
    getMenu(query, user) {
        return this.parentService.fetchMenu(query, user);
    }
    upsertOrder(idempotencyKey, payload, user) {
        if (!idempotencyKey) {
            throw new common_1.BadRequestException('Idempotency-Key header is required');
        }
        return this.parentService.createOrUpdateOrder(payload, idempotencyKey, user);
    }
    getOrders(month, user) {
        return this.parentService.listOrders(month, user);
    }
    recordPayment(payload, user) {
        return this.parentService.recordPayment(payload, user);
    }
};
exports.ParentController = ParentController;
__decorate([
    (0, common_1.Get)('students'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "listStudents", null);
__decorate([
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_query_dto_1.MenuQueryDto, Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Headers)('idempotency-key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_request_dto_1.OrderRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "upsertOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_request_dto_1.PaymentRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "recordPayment", null);
exports.ParentController = ParentController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'parent', version: '1' }),
    __metadata("design:paramtypes", [parent_service_1.ParentService])
], ParentController);
//# sourceMappingURL=parent.controller.js.map