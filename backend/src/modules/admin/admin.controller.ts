import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { MenuCategoryInputDto } from './dto/menu-category-input.dto';
import { MenuItemInputDto } from './dto/menu-item-input.dto';
import { ThemeSettingsDto } from './dto/theme-settings.dto';
import { CutoffSettingsDto } from './dto/cutoff-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('students/import')
  @UseInterceptors(FileInterceptor('file'))
  importStudents(
    @UploadedFile() file: unknown,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.importStudents(file, user);
  }

  @Get('students/template')
  downloadTemplate(@Res() res: Response) {
    const csv = this.adminService.getStudentImportTemplate();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="student_import_template.csv"',
    );
    res.send(csv);
  }

  @Get('students/export')
  async exportStudents(
    @CurrentUser() user: UserPayload,
    @Res() res: Response,
  ) {
    const csv = await this.adminService.exportStudents(user);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
    res.send(csv);
  }

  @Get('menu-categories')
  listCategories(@CurrentUser() user: UserPayload) {
    return this.adminService.listCategories(user);
  }

  @Post('menu-categories')
  createCategory(
    @Body() payload: MenuCategoryInputDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.createCategory(payload, user);
  }

  @Get('menu-items')
  listMenuItems(@CurrentUser() user: UserPayload) {
    return this.adminService.listMenuItems(user);
  }

  @Post('menu-items')
  createMenuItem(
    @Body() payload: MenuItemInputDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.createMenuItem(payload, user);
  }

  @Put('theme')
  updateTheme(
    @Body() payload: ThemeSettingsDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.updateTheme(payload, user);
  }

  @Put('cutoff')
  updateCutoff(
    @Body() payload: CutoffSettingsDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.updateCutoff(payload, user);
  }

  @Get('dashboard')
  dashboard(
    @Query('date') date: string | undefined,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.dashboard(date, user);
  }
}
