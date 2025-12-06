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
exports.OrderItemEntity = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const menu_item_entity_1 = require("./menu-item.entity");
const base_entity_1 = require("./base.entity");
let OrderItemEntity = class OrderItemEntity extends base_entity_1.AuditEntity {
    id;
    orderId;
    order;
    schoolId;
    menuItemId;
    menuItem;
    nameSnapshot;
    unitPrice;
    quantity;
    preferences;
};
exports.OrderItemEntity = OrderItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'order_item_id' }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'uuid' }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.OrderEntity, (order) => order.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.OrderEntity)
], OrderItemEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'menu_item_id', type: 'uuid' }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "menuItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItemEntity, (menuItem) => menuItem.orderItems),
    (0, typeorm_1.JoinColumn)({ name: 'menu_item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItemEntity)
], OrderItemEntity.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name_snapshot', type: 'text' }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "nameSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrderItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int' }),
    __metadata("design:type", Number)
], OrderItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preferences', type: 'text', array: true, default: '{}' }),
    __metadata("design:type", Array)
], OrderItemEntity.prototype, "preferences", void 0);
exports.OrderItemEntity = OrderItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_items' })
], OrderItemEntity);
//# sourceMappingURL=order-item.entity.js.map