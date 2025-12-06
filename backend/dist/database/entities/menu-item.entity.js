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
exports.MenuItemEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const menu_category_entity_1 = require("./menu-category.entity");
const enums_1 = require("../enums");
const order_item_entity_1 = require("./order-item.entity");
let MenuItemEntity = class MenuItemEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    categoryId;
    category;
    name;
    description;
    price;
    currency;
    nutrition;
    allergens;
    availability;
    version;
    imageUrl;
    isActive;
    orderItems;
};
exports.MenuItemEntity = MenuItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'item_id' }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, (school) => school.menuItems),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], MenuItemEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'uuid' }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_category_entity_1.MenuCategoryEntity, (category) => category.items, {
        eager: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", menu_category_entity_1.MenuCategoryEntity)
], MenuItemEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'text' }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MenuItemEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', type: 'text', default: 'INR' }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nutrition', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], MenuItemEntity.prototype, "nutrition", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allergens',
        type: 'enum',
        enum: enums_1.AllergyFlag,
        array: true,
        default: '{}',
    }),
    __metadata("design:type", Array)
], MenuItemEntity.prototype, "allergens", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'availability', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], MenuItemEntity.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], MenuItemEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], MenuItemEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItemEntity, (item) => item.menuItem),
    __metadata("design:type", Array)
], MenuItemEntity.prototype, "orderItems", void 0);
exports.MenuItemEntity = MenuItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'menu_items' })
], MenuItemEntity);
//# sourceMappingURL=menu-item.entity.js.map