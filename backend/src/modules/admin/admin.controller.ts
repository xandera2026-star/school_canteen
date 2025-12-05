import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { MenuCategoryInputDto } from './dto/menu-category-input.dto';
import { MenuItemInputDto } from './dto/menu-item-input.dto';
import { ThemeSettingsDto } from './dto/theme-settings.dto';
import { CutoffSettingsDto } from './dto/cutoff-settings.dto';

@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('students/import')
  @UseInterceptors(FileInterceptor('file'))
  importStudents(@UploadedFile() file: { originalname: string } | undefined) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }
    return this.adminService.importStudents(file.originalname);
  }

  @Get('menu-categories')
  listCategories() {
    return this.adminService.listCategories();
  }

  @Post('menu-categories')
  createCategory(@Body() payload: MenuCategoryInputDto) {
    return this.adminService.createCategory(payload);
  }

  @Get('menu-items')
  listMenuItems() {
    return this.adminService.listMenuItems();
  }

  @Post('menu-items')
  createMenuItem(@Body() payload: MenuItemInputDto) {
    return this.adminService.createMenuItem(payload);
  }

  @Put('theme')
  updateTheme(@Body() payload: ThemeSettingsDto) {
    return this.adminService.updateTheme(payload);
  }

  @Put('cutoff')
  updateCutoff(@Body() payload: CutoffSettingsDto) {
    return this.adminService.updateCutoff(payload);
  }

  @Get('dashboard')
  dashboard(@Query('date') date?: string) {
    return this.adminService.dashboard(date);
  }
}
