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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const parent_entity_1 = require("./parent.entity");
const student_entity_1 = require("./student.entity");
const enums_1 = require("../enums");
const order_item_entity_1 = require("./order-item.entity");
const payment_entity_1 = require("./payment.entity");
let OrderEntity = class OrderEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    studentId;
    student;
    parentId;
    parent;
    status;
    paymentStatus;
    serviceDate;
    specialInstructions;
    cutOffLocked;
    totalAmount;
    currency;
    items;
    payments;
};
exports.OrderEntity = OrderEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'order_id' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, (school) => school.orders),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], OrderEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', type: 'uuid' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.StudentEntity, (student) => student.orders),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.StudentEntity)
], OrderEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', type: 'uuid' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => parent_entity_1.ParentEntity, (parent) => parent.orders),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", parent_entity_1.ParentEntity)
], OrderEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: enums_1.OrderStatus,
        default: enums_1.OrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: enums_1.PaymentStatus,
        default: enums_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_date', type: 'date' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "serviceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_instructions', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "specialInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cut_off_locked', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], OrderEntity.prototype, "cutOffLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrderEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', type: 'text', default: 'INR' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItemEntity, (item) => item.order, { cascade: true }),
    __metadata("design:type", Array)
], OrderEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.PaymentEntity, (payment) => payment.order),
    __metadata("design:type", Array)
], OrderEntity.prototype, "payments", void 0);
exports.OrderEntity = OrderEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'orders' })
], OrderEntity);
//# sourceMappingURL=order.entity.js.map