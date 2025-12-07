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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_service_1 = require("./admin.service");
const menu_category_input_dto_1 = require("./dto/menu-category-input.dto");
const menu_item_input_dto_1 = require("./dto/menu-item-input.dto");
const theme_settings_dto_1 = require("./dto/theme-settings.dto");
const cutoff_settings_dto_1 = require("./dto/cutoff-settings.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    importStudents(file, user) {
        return this.adminService.importStudents(file, user);
    }
    downloadTemplate(res) {
        const csv = this.adminService.getStudentImportTemplate();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="student_import_template.csv"');
        res.send(csv);
    }
    async exportStudents(user, res) {
        const csv = await this.adminService.exportStudents(user);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
        res.send(csv);
    }
    listCategories(user) {
        return this.adminService.listCategories(user);
    }
    createCategory(payload, user) {
        return this.adminService.createCategory(payload, user);
    }
    listMenuItems(user) {
        return this.adminService.listMenuItems(user);
    }
    createMenuItem(payload, user) {
        return this.adminService.createMenuItem(payload, user);
    }
    updateTheme(payload, user) {
        return this.adminService.updateTheme(payload, user);
    }
    updateCutoff(payload, user) {
        return this.adminService.updateCutoff(payload, user);
    }
    dashboard(date, user) {
        return this.adminService.dashboard(date, user);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('students/import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importStudents", null);
__decorate([
    (0, common_1.Get)('students/template'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "downloadTemplate", null);
__decorate([
    (0, common_1.Get)('students/export'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportStudents", null);
__decorate([
    (0, common_1.Get)('menu-categories'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listCategories", null);
__decorate([
    (0, common_1.Post)('menu-categories'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_category_input_dto_1.MenuCategoryInputDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('menu-items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listMenuItems", null);
__decorate([
    (0, common_1.Post)('menu-items'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_item_input_dto_1.MenuItemInputDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Put)('theme'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [theme_settings_dto_1.ThemeSettingsDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateTheme", null);
__decorate([
    (0, common_1.Put)('cutoff'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cutoff_settings_dto_1.CutoffSettingsDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateCutoff", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "dashboard", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'admin', version: '1' }),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map