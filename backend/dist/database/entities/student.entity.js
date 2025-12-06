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
exports.StudentEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const parent_child_entity_1 = require("./parent-child.entity");
const order_entity_1 = require("./order.entity");
const enums_1 = require("../enums");
let StudentEntity = class StudentEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    name;
    rollNumber;
    className;
    section;
    photoUrl;
    isActive;
    allergyFlags;
    parents;
    orders;
};
exports.StudentEntity = StudentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'student_id' }),
    __metadata("design:type", String)
], StudentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], StudentEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, (school) => school.students),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], StudentEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'text' }),
    __metadata("design:type", String)
], StudentEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'roll_number', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "rollNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'class_name', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "className", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'photo_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentEntity.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StudentEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allergy_flags',
        type: 'enum',
        enum: enums_1.AllergyFlag,
        array: true,
        default: '{}',
    }),
    __metadata("design:type", Array)
], StudentEntity.prototype, "allergyFlags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parent_child_entity_1.ParentChildEntity, (item) => item.student),
    __metadata("design:type", Array)
], StudentEntity.prototype, "parents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.OrderEntity, (order) => order.student),
    __metadata("design:type", Array)
], StudentEntity.prototype, "orders", void 0);
exports.StudentEntity = StudentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'students' })
], StudentEntity);
//# sourceMappingURL=student.entity.js.map