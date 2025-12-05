import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
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
import { UserPayload } from '../auth/interfaces/user-payload.interface';

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
