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
exports.ParentEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const parent_child_entity_1 = require("./parent-child.entity");
const order_entity_1 = require("./order.entity");
let ParentEntity = class ParentEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    name;
    mobile;
    email;
    status;
    firebaseUid;
    children;
    orders;
};
exports.ParentEntity = ParentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'parent_id' }),
    __metadata("design:type", String)
], ParentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], ParentEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, (school) => school.parents),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], ParentEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ParentEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile', type: 'text' }),
    __metadata("design:type", String)
], ParentEntity.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ParentEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'text', default: 'active' }),
    __metadata("design:type", String)
], ParentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'firebase_uid', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ParentEntity.prototype, "firebaseUid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parent_child_entity_1.ParentChildEntity, (item) => item.parent),
    __metadata("design:type", Array)
], ParentEntity.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.OrderEntity, (order) => order.parent),
    __metadata("design:type", Array)
], ParentEntity.prototype, "orders", void 0);
exports.ParentEntity = ParentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'parents' })
], ParentEntity);
//# sourceMappingURL=parent.entity.js.map