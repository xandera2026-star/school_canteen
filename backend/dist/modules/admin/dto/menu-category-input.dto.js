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
exports.MenuCategoryInputDto = exports.MenuCategoryType = void 0;
const class_validator_1 = require("class-validator");
var MenuCategoryType;
(function (MenuCategoryType) {
    MenuCategoryType["VEG"] = "veg";
    MenuCategoryType["NON_VEG"] = "non_veg";
    MenuCategoryType["SNACKS"] = "snacks";
    MenuCategoryType["SOUTH_INDIAN"] = "south_indian";
    MenuCategoryType["NORTH_INDIAN"] = "north_indian";
    MenuCategoryType["SPECIAL"] = "special";
    MenuCategoryType["DRINKS"] = "drinks";
})(MenuCategoryType || (exports.MenuCategoryType = MenuCategoryType = {}));
class MenuCategoryInputDto {
    name;
    type;
    description;
}
exports.MenuCategoryInputDto = MenuCategoryInputDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MenuCategoryInputDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(MenuCategoryType),
    __metadata("design:type", String)
], MenuCategoryInputDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MenuCategoryInputDto.prototype, "description", void 0);
//# sourceMappingURL=menu-category-input.dto.js.map