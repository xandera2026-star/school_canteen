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
exports.SubscriptionEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const school_entity_1 = require("./school.entity");
const enums_1 = require("../enums");
let SubscriptionEntity = class SubscriptionEntity extends base_entity_1.AuditEntity {
    id;
    schoolId;
    school;
    plan;
    status;
    startedAt;
    endsAt;
    metadata;
};
exports.SubscriptionEntity = SubscriptionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'subscription_id' }),
    __metadata("design:type", String)
], SubscriptionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_entity_1.SchoolEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'school_id' }),
    __metadata("design:type", school_entity_1.SchoolEntity)
], SubscriptionEntity.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan', type: 'enum', enum: enums_1.SubscriptionPlan }),
    __metadata("design:type", String)
], SubscriptionEntity.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'text', default: 'active' }),
    __metadata("design:type", String)
], SubscriptionEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], SubscriptionEntity.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ends_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SubscriptionEntity.prototype, "endsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metadata', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SubscriptionEntity.prototype, "metadata", void 0);
exports.SubscriptionEntity = SubscriptionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'subscriptions' })
], SubscriptionEntity);
//# sourceMappingURL=subscription.entity.js.map