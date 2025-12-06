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
exports.ParentChildEntity = void 0;
const typeorm_1 = require("typeorm");
const parent_entity_1 = require("./parent.entity");
const student_entity_1 = require("./student.entity");
const school_entity_1 = require("./school.entity");
let ParentChildEntity = class ParentChildEntity {
    parentId;
    studentId;
    schoolId;
    relationship;
    parent;
    student;
    school;
};
exports.ParentChildEntity = ParentChildEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'parent_id', type: 'uuid' }),
    __metadata("design:type", String)
], ParentChildEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'student_id', type: 'uuid' }),
    __metadata("design:type", String)
], ParentChildEntity.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], ParentChildEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'relationship', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ParentChildEntity.prototype, "relationship", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => parent_entity_1.ParentEntity, (parent) => parent.children, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", parent_entity_1.ParentEntity)
], ParentChildEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.StudentEntity, (student) => student.parents, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.StudentEntity)
], ParentChildEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], ParentChildEntity.prototype, "school", void 0);
exports.ParentChildEntity = ParentChildEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'parent_children' })
], ParentChildEntity);
//# sourceMappingURL=parent-child.entity.js.map