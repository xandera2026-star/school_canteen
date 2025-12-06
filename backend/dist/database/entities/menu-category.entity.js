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
exports.MenuCategoryEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const enums_1 = require("../enums");
const menu_item_entity_1 = require("./menu-item.entity");
let MenuCategoryEntity = class MenuCategoryEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    name;
    type;
    description;
    items;
};
exports.MenuCategoryEntity = MenuCategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'category_id' }),
    __metadata("design:type", String)
], MenuCategoryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], MenuCategoryEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, (school) => school.menuCategories),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], MenuCategoryEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'text' }),
    __metadata("design:type", String)
], MenuCategoryEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'type',
        type: 'enum',
        enum: enums_1.MenuCategoryType,
    }),
    __metadata("design:type", String)
], MenuCategoryEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuCategoryEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_item_entity_1.MenuItemEntity, (item) => item.category),
    __metadata("design:type", Array)
], MenuCategoryEntity.prototype, "items", void 0);
exports.MenuCategoryEntity = MenuCategoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'menu_categories' })
], MenuCategoryEntity);
//# sourceMappingURL=menu-category.entity.js.map