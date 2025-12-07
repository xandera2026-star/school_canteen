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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sync_1 = require("csv-parse/sync");
const crypto_1 = require("crypto");
const entities_1 = require("../../database/entities");
const enums_1 = require("../../database/enums");
const payment_request_dto_1 = require("../parent/dto/payment-request.dto");
let AdminService = class AdminService {
    dataSource;
    categoryRepository;
    menuItemRepository;
    orderRepository;
    orderItemRepository;
    paymentRepository;
    settingsRepository;
    studentRepository;
    parentRepository;
    parentChildRepository;
    schoolRepository;
    constructor(dataSource, categoryRepository, menuItemRepository, orderRepository, orderItemRepository, paymentRepository, settingsRepository, studentRepository, parentRepository, parentChildRepository, schoolRepository) {
        this.dataSource = dataSource;
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.settingsRepository = settingsRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.parentChildRepository = parentChildRepository;
        this.schoolRepository = schoolRepository;
    }
    async importStudents(file, user) {
        if (!user.schoolId) {
            throw new common_1.BadRequestException('school context missing');
        }
        const csvFile = this.ensureCsvFile(file);
        const csvBuffer = csvFile.buffer;
        if (!csvBuffer?.length) {
            throw new common_1.BadRequestException('CSV payload is empty');
        }
        const rows = this.parseCsv(csvBuffer.toString('utf-8'));
        const stats = {
            import_id: (0, crypto_1.randomUUID)(),
            processed: 0,
            students_created: 0,
            students_updated: 0,
            parents_created: 0,
        };
        await this.dataSource.transaction(async (manager) => {
            const studentRepo = manager.getRepository(entities_1.StudentEntity);
            const parentRepo = manager.getRepository(entities_1.ParentEntity);
            const linkRepo = manager.getRepository(entities_1.ParentChildEntity);
            for (const row of rows) {
                stats.processed += 1;
                if (!row.student_name || !row.parent_mobile) {
                    throw new common_1.BadRequestException(`Row ${stats.processed} missing required student_name/parent_mobile`);
                }
                const normalizedMobile = row.parent_mobile.replace(/\s+/g, '');
                let parent = await parentRepo.findOne({
                    where: { schoolId: user.schoolId, mobile: normalizedMobile },
                });
                if (!parent) {
                    parent = parentRepo.create({
                        schoolId: user.schoolId,
                        name: row.parent_name,
                        mobile: normalizedMobile,
                        email: row.parent_email,
                        status: 'active',
                    });
                    parent = await parentRepo.save(parent);
                    stats.parents_created += 1;
                }
                else {
                    parent.name = row.parent_name ?? parent.name;
                    parent.email = row.parent_email ?? parent.email;
                    await parentRepo.save(parent);
                }
                const allergies = this.parseAllergies(row.allergy_info);
                const studentWhere = {
                    schoolId: user.schoolId,
                };
                if (row.roll_number) {
                    studentWhere.rollNumber = row.roll_number;
                }
                else {
                    studentWhere.name = row.student_name;
                    if (row.class) {
                        studentWhere.className = row.class;
                    }
                    if (row.section) {
                        studentWhere.section = row.section;
                    }
                }
                let student = await studentRepo.findOne({
                    where: studentWhere,
                });
                if (!student) {
                    student = studentRepo.create({
                        schoolId: user.schoolId,
                        name: row.student_name,
                        rollNumber: row.roll_number,
                        className: row.class,
                        section: row.section,
                        isActive: this.normalizeBoolean(row.is_active, true),
                        allergyFlags: allergies,
                    });
                    student = await studentRepo.save(student);
                    stats.students_created += 1;
                }
                else {
                    student.name = row.student_name;
                    student.className = row.class;
                    student.section = row.section;
                    student.isActive = this.normalizeBoolean(row.is_active, student.isActive);
                    student.allergyFlags = allergies;
                    await studentRepo.save(student);
                    stats.students_updated += 1;
                }
                const linkExists = await linkRepo.findOne({
                    where: { parentId: parent.id, studentId: student.id },
                });
                if (!linkExists) {
                    await linkRepo.save(linkRepo.create({
                        parentId: parent.id,
                        studentId: student.id,
                        schoolId: user.schoolId,
                    }));
                }
            }
        });
        return { data: stats };
    }
    async listCategories(user) {
        const categories = await this.categoryRepository.find({
            where: { schoolId: user.schoolId },
            order: { name: 'ASC' },
        });
        return {
            data: categories.map((category) => ({
                category_id: category.id,
                name: category.name,
                type: category.type,
                description: category.description,
            })),
        };
    }
    async createCategory(payload, user) {
        const category = this.categoryRepository.create({
            schoolId: user.schoolId,
            name: payload.name,
            type: payload.type,
            description: payload.description,
        });
        await this.categoryRepository.save(category);
        return { data: { category_id: category.id, ...payload } };
    }
    async listMenuItems(user) {
        const items = await this.menuItemRepository.find({
            where: { schoolId: user.schoolId },
            relations: { category: true },
            order: { name: 'ASC' },
        });
        return {
            data: items.map((item) => ({
                item_id: item.id,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                currency: item.currency,
                category_id: item.categoryId,
                category_name: item.category?.name,
                allergens: item.allergens ?? [],
                is_active: item.isActive,
                availability: item.availability,
                image_url: item.imageUrl,
            })),
        };
    }
    async createMenuItem(payload, user) {
        const category = await this.categoryRepository.findOne({
            where: { id: payload.category_id, schoolId: user.schoolId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category not found in this school');
        }
        const item = this.menuItemRepository.create({
            schoolId: user.schoolId,
            categoryId: payload.category_id,
            name: payload.name,
            description: payload.description,
            price: payload.price,
            currency: payload.currency ?? 'INR',
            nutrition: payload.nutrition,
            allergens: payload.allergens,
            availability: payload.availability
                ? { ...payload.availability }
                : undefined,
            imageUrl: payload.image_url,
            isActive: payload.is_active ?? true,
        });
        await this.menuItemRepository.save(item);
        return { data: { item_id: item.id } };
    }
    async updateTheme(payload, user) {
        if (!user.schoolId) {
            throw new common_1.BadRequestException('school context missing');
        }
        let settings = await this.settingsRepository.findOne({
            where: { schoolId: user.schoolId },
        });
        if (!settings) {
            settings = this.settingsRepository.create({ schoolId: user.schoolId });
        }
        settings.themePrimary = payload.primary_color ?? settings.themePrimary;
        settings.themeAccent = payload.accent_color ?? settings.themeAccent;
        settings.logoUrl = payload.logo_url ?? settings.logoUrl;
        await this.settingsRepository.save(settings);
        return { data: payload };
    }
    async updateCutoff(payload, user) {
        let settings = await this.settingsRepository.findOne({
            where: { schoolId: user.schoolId },
        });
        if (!settings) {
            settings = this.settingsRepository.create({ schoolId: user.schoolId });
        }
        settings.cutoffTime = payload.cutoff_time;
        settings.timezone = payload.timezone;
        await this.settingsRepository.save(settings);
        return { data: payload };
    }
    async dashboard(date, user) {
        const serviceDate = date ?? new Date().toISOString().slice(0, 10);
        const schoolId = user.schoolId;
        if (!schoolId) {
            throw new common_1.BadRequestException('school context missing');
        }
        const [ordersToday, paymentAggregates, topItemsRaw, orderedStudentsRaw, students, school,] = await Promise.all([
            this.orderRepository.count({ where: { schoolId, serviceDate } }),
            this.paymentRepository
                .createQueryBuilder('payment')
                .leftJoin('payment.order', 'order')
                .where('payment.school_id = :schoolId', { schoolId })
                .andWhere('order.service_date = :serviceDate', { serviceDate })
                .andWhere('payment.status = :status', { status: enums_1.PaymentStatus.PAID })
                .select('payment.method', 'method')
                .addSelect('SUM(payment.amount)', 'total')
                .groupBy('payment.method')
                .getRawMany(),
            this.orderItemRepository
                .createQueryBuilder('item')
                .leftJoin('item.order', 'order')
                .where('order.school_id = :schoolId', { schoolId })
                .andWhere('order.service_date = :serviceDate', { serviceDate })
                .select('item.name_snapshot', 'name')
                .addSelect('SUM(item.quantity)', 'count')
                .groupBy('item.name_snapshot')
                .orderBy('count', 'DESC')
                .limit(5)
                .getRawMany(),
            this.orderRepository
                .createQueryBuilder('order')
                .select('DISTINCT order.student_id', 'student_id')
                .where('order.school_id = :schoolId', { schoolId })
                .andWhere('order.service_date = :serviceDate', { serviceDate })
                .getRawMany(),
            this.studentRepository.find({ where: { schoolId, isActive: true } }),
            this.schoolRepository.findOne({ where: { id: schoolId } }),
        ]);
        const orderedStudentIds = orderedStudentsRaw.map((raw) => raw.student_id);
        const missingStudents = students
            .filter((student) => !orderedStudentIds.includes(student.id))
            .map((student) => ({
            student_id: student.id,
            name: student.name,
            class: student.className,
            section: student.section,
        }));
        const totals = paymentAggregates.reduce((acc, row) => {
            acc[row.method] = Number(row.total);
            return acc;
        }, {});
        const gpayTotal = totals[payment_request_dto_1.PaymentMethod.GPAY_UPI] ?? 0;
        const cashTotal = totals[payment_request_dto_1.PaymentMethod.CASH] ?? 0;
        return {
            data: {
                date: serviceDate,
                orders_today: ordersToday,
                gpay_total: gpayTotal,
                cash_total: cashTotal,
                top_items: topItemsRaw.map((item) => ({
                    name: item.name,
                    count: Number(item.count),
                })),
                missing_students: missingStudents,
                school_name: school?.name,
            },
        };
    }
    parseCsv(content) {
        return (0, sync_1.parse)(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    }
    ensureCsvFile(file) {
        if (!file || typeof file !== 'object') {
            throw new common_1.BadRequestException('CSV file is required');
        }
        const candidate = file;
        if (!candidate.buffer || !Buffer.isBuffer(candidate.buffer)) {
            throw new common_1.BadRequestException('CSV file buffer missing');
        }
        return candidate;
    }
    parseAllergies(info) {
        if (!info) {
            return [];
        }
        const map = {
            nuts: enums_1.AllergyFlag.NUTS,
            gluten: enums_1.AllergyFlag.GLUTEN,
            lactose: enums_1.AllergyFlag.LACTOSE,
            spicy: enums_1.AllergyFlag.SPICY,
        };
        return info
            .split(/[,;]+/)
            .map((entry) => entry.trim().toLowerCase())
            .filter(Boolean)
            .map((token) => map[token])
            .filter((flag) => Boolean(flag));
    }
    normalizeBoolean(value, fallback) {
        if (value === undefined || value === null) {
            return fallback;
        }
        const token = value.toString().trim().toLowerCase();
        if (['true', '1', 'yes', 'active'].includes(token)) {
            return true;
        }
        if (['false', '0', 'no', 'inactive'].includes(token)) {
            return false;
        }
        return fallback;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MenuCategoryEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.MenuItemEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.OrderEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.OrderItemEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.PaymentEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.SchoolSettingsEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.StudentEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.ParentEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(entities_1.ParentChildEntity)),
    __param(10, (0, typeorm_1.InjectRepository)(entities_1.SchoolEntity)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map