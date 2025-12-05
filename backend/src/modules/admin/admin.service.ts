import { Injectable } from '@nestjs/common';
import { MenuCategoryInputDto } from './dto/menu-category-input.dto';
import { MenuItemInputDto } from './dto/menu-item-input.dto';
import { ThemeSettingsDto } from './dto/theme-settings.dto';
import { CutoffSettingsDto } from './dto/cutoff-settings.dto';

@Injectable()
export class AdminService {
  importStudents(filename: string) {
    return { data: { import_id: 'import-1', filename, status: 'pending' } };
  }

  listCategories() {
    return {
      data: [
        {
          category_id: 'cat-veg',
          name: 'Veg',
          type: 'veg',
          description: 'Vegetarian dishes',
        },
      ],
    };
  }

  createCategory(payload: MenuCategoryInputDto) {
    return { data: { category_id: 'new-cat', ...payload } };
  }

  listMenuItems() {
    return {
      data: [
        {
          item_id: 'item-1',
          name: 'Veg Biriyani',
          category_id: 'cat-veg',
          price: 80,
          currency: 'INR',
        },
      ],
    };
  }

  createMenuItem(payload: MenuItemInputDto) {
    return { data: { item_id: 'new-item', ...payload } };
  }

  updateTheme(payload: ThemeSettingsDto) {
    return { data: { ...payload } };
  }

  updateCutoff(payload: CutoffSettingsDto) {
    return { data: payload };
  }

  dashboard(date?: string) {
    return {
      data: {
        date,
        orders_today: 152,
        gpay_total: 8200,
        cash_total: 3100,
        top_items: [
          { name: 'Lemon Rice', count: 120 },
          { name: 'Veg Biriyani', count: 80 },
        ],
        missing_students: [],
      },
    };
  }
}
