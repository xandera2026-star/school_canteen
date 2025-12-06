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
exports.AllergyFlagEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const student_entity_1 = require("./student.entity");
const enums_1 = require("../enums");
let AllergyFlagEntity = class AllergyFlagEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    studentId;
    student;
    flag;
    notes;
};
exports.AllergyFlagEntity = AllergyFlagEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'flag_id' }),
    __metadata("design:type", String)
], AllergyFlagEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], AllergyFlagEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], AllergyFlagEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AllergyFlagEntity.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.StudentEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.StudentEntity)
], AllergyFlagEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flag', type: 'enum', enum: enums_1.AllergyFlag }),
    __metadata("design:type", String)
], AllergyFlagEntity.prototype, "flag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AllergyFlagEntity.prototype, "notes", void 0);
exports.AllergyFlagEntity = AllergyFlagEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'allergy_flags' })
], AllergyFlagEntity);
//# sourceMappingURL=allergy-flag.entity.js.map