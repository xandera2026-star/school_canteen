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
exports.IdempotencyKeyEntity = void 0;
const typeorm_1 = require("typeorm");
let IdempotencyKeyEntity = class IdempotencyKeyEntity {
    key;
    schoolId;
    parentId;
    responseCode;
    responseBody;
    expiresAt;
    createdAt;
};
exports.IdempotencyKeyEntity = IdempotencyKeyEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'key', type: 'text' }),
    __metadata("design:type", String)
], IdempotencyKeyEntity.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'school_id', type: 'uuid' }),
    __metadata("design:type", String)
], IdempotencyKeyEntity.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], IdempotencyKeyEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_code', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IdempotencyKeyEntity.prototype, "responseCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_body', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], IdempotencyKeyEntity.prototype, "responseBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], IdempotencyKeyEntity.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamptz', default: () => 'now()' }),
    __metadata("design:type", Date)
], IdempotencyKeyEntity.prototype, "createdAt", void 0);
exports.IdempotencyKeyEntity = IdempotencyKeyEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'idempotency_keys' })
], IdempotencyKeyEntity);
//# sourceMappingURL=idempotency-key.entity.js.map