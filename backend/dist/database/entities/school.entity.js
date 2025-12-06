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
exports.SchoolEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_settings_entity_1 = require("./school-settings.entity");
const parent_entity_1 = require("./parent.entity");
const student_entity_1 = require("./student.entity");
const menu_category_entity_1 = require("./menu-category.entity");
const menu_item_entity_1 = require("./menu-item.entity");
const order_entity_1 = require("./order.entity");
let SchoolEntity = class SchoolEntity extends base_entity_1.AuditEntity {
    id;
    ownerId;
    schoolCode;
    name;
    addressLine1;
    addressLine2;
    city;
    state;
    postalCode;
    country;
    status;
    settings;
    parents;
    students;
    menuCategories;
    menuItems;
    orders;
};
exports.SchoolEntity = SchoolEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'school_id' }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_id', type: 'uuid' }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_code', type: 'text', unique: true }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "schoolCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'text' }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', type: 'text' }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'text', default: 'IN' }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'text', default: 'trial' }),
    __metadata("design:type", String)
], SchoolEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => school_settings_entity_1.SchoolSettingsEntity, (settings) => settings.school),
    __metadata("design:type", school_settings_entity_1.SchoolSettingsEntity)
], SchoolEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parent_entity_1.ParentEntity, (parent) => parent.school),
    __metadata("design:type", Array)
], SchoolEntity.prototype, "parents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_entity_1.StudentEntity, (student) => student.school),
    __metadata("design:type", Array)
], SchoolEntity.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_category_entity_1.MenuCategoryEntity, (category) => category.school),
    __metadata("design:type", Array)
], SchoolEntity.prototype, "menuCategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_item_entity_1.MenuItemEntity, (item) => item.school),
    __metadata("design:type", Array)
], SchoolEntity.prototype, "menuItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.OrderEntity, (order) => order.school),
    __metadata("design:type", Array)
], SchoolEntity.prototype, "orders", void 0);
exports.SchoolEntity = SchoolEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'schools' })
], SchoolEntity);
//# sourceMappingURL=school.entity.js.map