import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MenuCategoryInputDto } from './dto/menu-category-input.dto';
import { MenuItemInputDto } from './dto/menu-item-input.dto';
import { ThemeSettingsDto } from './dto/theme-settings.dto';
import { CutoffSettingsDto } from './dto/cutoff-settings.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import {
  MenuCategoryEntity,
  MenuItemEntity,
  OrderEntity,
  OrderItemEntity,
  ParentChildEntity,
  ParentEntity,
  PaymentEntity,
  SchoolEntity,
  SchoolSettingsEntity,
  StudentEntity,
} from '../../database/entities';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { PaymentStatus, AllergyFlag } from '../../database/enums';
import { PaymentMethod } from '../parent/dto/payment-request.dto';

interface StudentRow {
  student_name: string;
  roll_number?: string;
  class?: string;
  section?: string;
  parent_name?: string;
  parent_mobile?: string;
  parent_email?: string;
  allergy_info?: string;
  is_active?: string;
}

type CsvImportFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

const STUDENT_TEMPLATE_FALLBACK = `student_name,roll_number,class,section,parent_name,parent_mobile,parent_email,allergy_info,is_active
Aarav Krishnan,SVSS-101,IX,A,Meera Krishnan,919876543210,meera.krishnan@example.com,"nuts; lactose",true
Diya Raman,SVSS-102,IX,A,Raman Subramani,919812345678,raman.subramani@example.com,gluten,true
Kavin Raj,SVSS-201,X,B,Saranya Raj,919845612378,saranya.raj@example.com,none,true
Mithra S,SVSS-305,VIII,C,Srinivasan Kumar,919834567890,srinivasan.kumar@example.com,"spicy; nuts",false`;

const TEMPLATE_PATH_CANDIDATES = [
  join(process.cwd(), '../docs/student_import_template.csv'),
  join(process.cwd(), 'docs/student_import_template.csv'),
];

const STUDENT_TEMPLATE_CSV = (() => {
  for (const path of TEMPLATE_PATH_CANDIDATES) {
    try {
      return readFileSync(path, 'utf-8');
    } catch {
      // continue
    }
  }
  return STUDENT_TEMPLATE_FALLBACK;
})();

const CSV_HEADER =
  'student_name,roll_number,class,section,parent_name,parent_mobile,parent_email,allergy_info,is_active';

const PRINTABLE_SCALAR_TYPES = new Set(['string', 'number', 'boolean', 'bigint']);
const isPrintableScalar = (
  value: unknown,
): value is string | number | boolean | bigint => {
  return PRINTABLE_SCALAR_TYPES.has(typeof value);
};

const csvEscape = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  if (!isPrintableScalar(value)) {
    return '';
  }
  const normalized = String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(MenuCategoryEntity)
    private readonly categoryRepository: Repository<MenuCategoryEntity>,
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItemEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(SchoolSettingsEntity)
    private readonly settingsRepository: Repository<SchoolSettingsEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
    @InjectRepository(ParentChildEntity)
    private readonly parentChildRepository: Repository<ParentChildEntity>,
    @InjectRepository(SchoolEntity)
    private readonly schoolRepository: Repository<SchoolEntity>,
  ) {}

  async importStudents(file: unknown, user: UserPayload) {
    if (!user.schoolId) {
      throw new BadRequestException('school context missing');
    }
    const csvFile = this.ensureCsvFile(file);
    const csvBuffer = csvFile.buffer;
    if (!csvBuffer?.length) {
      throw new BadRequestException('CSV payload is empty');
    }

    const rows = this.parseCsv(csvBuffer.toString('utf-8'));
    const stats = {
      import_id: randomUUID(),
      processed: 0,
      students_created: 0,
      students_updated: 0,
      parents_created: 0,
    };

    await this.dataSource.transaction(async (manager) => {
      const studentRepo = manager.getRepository(StudentEntity);
      const parentRepo = manager.getRepository(ParentEntity);
      const linkRepo = manager.getRepository(ParentChildEntity);

      for (const row of rows) {
        stats.processed += 1;
        if (!row.student_name || !row.parent_mobile) {
          throw new BadRequestException(
            `Row ${stats.processed} missing required student_name/parent_mobile`,
          );
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
        } else {
          parent.name = row.parent_name ?? parent.name;
          parent.email = row.parent_email ?? parent.email;
          await parentRepo.save(parent);
        }

        const allergies = this.parseAllergies(row.allergy_info);
        const studentWhere: FindOptionsWhere<StudentEntity> = {
          schoolId: user.schoolId,
        };
        if (row.roll_number) {
          studentWhere.rollNumber = row.roll_number;
        } else {
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
        } else {
          student.name = row.student_name;
          student.className = row.class;
          student.section = row.section;
          student.isActive = this.normalizeBoolean(
            row.is_active,
            student.isActive,
          );
          student.allergyFlags = allergies;
          await studentRepo.save(student);
          stats.students_updated += 1;
        }

        const linkExists = await linkRepo.findOne({
          where: { parentId: parent.id, studentId: student.id },
        });
        if (!linkExists) {
          await linkRepo.save(
            linkRepo.create({
              parentId: parent.id,
              studentId: student.id,
              schoolId: user.schoolId,
            }),
          );
        }
      }
    });

    return { data: stats };
  }

  getStudentImportTemplate() {
    return STUDENT_TEMPLATE_CSV;
  }

  async exportStudents(user: UserPayload) {
    if (!user.schoolId) {
      throw new BadRequestException('school context missing');
    }

    const [students, parentLinks] = await Promise.all([
      this.studentRepository.find({
        where: { schoolId: user.schoolId },
        order: { name: 'ASC' },
      }),
      this.parentChildRepository.find({
        where: { schoolId: user.schoolId },
        relations: { parent: true },
      }),
    ]);

    const parentByStudent = new Map<string, ParentEntity>();
    for (const link of parentLinks) {
      if (!parentByStudent.has(link.studentId) && link.parent) {
        parentByStudent.set(link.studentId, link.parent);
      }
    }

    const rows = students.map((student) => {
      const parent = parentByStudent.get(student.id);
      const allergyInfo = (student.allergyFlags ?? []).join('; ');
      const csvRow = [
        student.name ?? '',
        student.rollNumber ?? '',
        student.className ?? '',
        student.section ?? '',
        parent?.name ?? '',
        parent?.mobile ?? '',
        parent?.email ?? '',
        allergyInfo,
        student.isActive ? 'true' : 'false',
      ];
      return csvRow.map(csvEscape).join(',');
    });

    return [CSV_HEADER, ...rows].join('\n');
  }

  async listCategories(user: UserPayload) {
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

  async createCategory(payload: MenuCategoryInputDto, user: UserPayload) {
    const category = this.categoryRepository.create({
      schoolId: user.schoolId,
      name: payload.name,
      type: payload.type,
      description: payload.description,
    });
    await this.categoryRepository.save(category);
    return { data: { category_id: category.id, ...payload } };
  }

  async listMenuItems(user: UserPayload) {
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

  async createMenuItem(payload: MenuItemInputDto, user: UserPayload) {
    const category = await this.categoryRepository.findOne({
      where: { id: payload.category_id, schoolId: user.schoolId },
    });
    if (!category) {
      throw new BadRequestException('Category not found in this school');
    }
    const item = this.menuItemRepository.create({
      schoolId: user.schoolId,
      categoryId: payload.category_id,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      currency: payload.currency ?? 'INR',
      nutrition: payload.nutrition,
      allergens: payload.allergens as AllergyFlag[] | undefined,
      availability: payload.availability
        ? { ...payload.availability }
        : undefined,
      imageUrl: payload.image_url,
      isActive: payload.is_active ?? true,
    });
    await this.menuItemRepository.save(item);
    return { data: { item_id: item.id } };
  }

  async updateTheme(payload: ThemeSettingsDto, user: UserPayload) {
    if (!user.schoolId) {
      throw new BadRequestException('school context missing');
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

  async updateCutoff(payload: CutoffSettingsDto, user: UserPayload) {
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

  async dashboard(date: string | undefined, user: UserPayload) {
    const serviceDate = date ?? new Date().toISOString().slice(0, 10);
    const schoolId = user.schoolId;
    if (!schoolId) {
      throw new BadRequestException('school context missing');
    }

    const [
      ordersToday,
      paymentAggregates,
      topItemsRaw,
      orderedStudentsRaw,
      students,
      school,
    ] = await Promise.all([
      this.orderRepository.count({ where: { schoolId, serviceDate } }),
      this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoin('payment.order', 'order')
        .where('payment.school_id = :schoolId', { schoolId })
        .andWhere('order.service_date = :serviceDate', { serviceDate })
        .andWhere('payment.status = :status', { status: PaymentStatus.PAID })
        .select('payment.method', 'method')
        .addSelect('SUM(payment.amount)', 'total')
        .groupBy('payment.method')
        .getRawMany<{ method: PaymentMethod; total: string }>(),
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
        .getRawMany<{ name: string; count: string }>(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('DISTINCT order.student_id', 'student_id')
        .where('order.school_id = :schoolId', { schoolId })
        .andWhere('order.service_date = :serviceDate', { serviceDate })
        .getRawMany<{ student_id: string }>(),
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

    const totals = paymentAggregates.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.method] = Number(row.total);
        return acc;
      },
      {},
    );
    const gpayTotal = totals[PaymentMethod.GPAY_UPI] ?? 0;
    const cashTotal = totals[PaymentMethod.CASH] ?? 0;

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

  async listOrders(query: OrderQueryDto, user: UserPayload) {
    const schoolId = user.schoolId;
    if (!schoolId) {
      throw new BadRequestException('school context missing');
    }
    const serviceDate = query.date ?? new Date().toISOString().slice(0, 10);

    const orders = await this.orderRepository.find({
      where: { schoolId, serviceDate },
      relations: { items: true, student: true, parent: true },
      order: { createdAt: 'DESC' },
    });

    return {
      data: orders.map((order) => ({
        order_id: order.id,
        student_id: order.studentId,
        student_name: order.student?.name,
        class: order.student?.className,
        section: order.student?.section,
        parent_id: order.parentId,
        parent_name: order.parent?.name,
        parent_mobile: order.parent?.mobile,
        status: order.status,
        payment_status: order.paymentStatus,
        service_date: order.serviceDate,
        total_amount: Number(order.totalAmount),
        currency: order.currency,
        items:
          order.items?.map((item) => ({
            menu_item_id: item.menuItemId,
            name: item.nameSnapshot,
            quantity: item.quantity,
          })) ?? [],
      })),
    };
  }

  private parseCsv(content: string): StudentRow[] {
    return parse<StudentRow>(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  }

  private ensureCsvFile(file: unknown): CsvImportFile {
    if (!file || typeof file !== 'object') {
      throw new BadRequestException('CSV file is required');
    }
    const candidate = file as Partial<CsvImportFile>;
    if (!candidate.buffer || !Buffer.isBuffer(candidate.buffer)) {
      throw new BadRequestException('CSV file buffer missing');
    }
    return candidate as CsvImportFile;
  }

  private parseAllergies(info?: string): AllergyFlag[] {
    if (!info) {
      return [];
    }
    const map: Record<string, AllergyFlag> = {
      nuts: AllergyFlag.NUTS,
      gluten: AllergyFlag.GLUTEN,
      lactose: AllergyFlag.LACTOSE,
      spicy: AllergyFlag.SPICY,
    };
    return info
      .split(/[,;]+/)
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
      .map((token) => map[token])
      .filter((flag): flag is AllergyFlag => Boolean(flag));
  }

  private normalizeBoolean(
    value: string | undefined,
    fallback: boolean,
  ): boolean {
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
}
