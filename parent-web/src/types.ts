export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  roles: string[];
  school_id?: string;
}

export interface Student {
  student_id: string;
  name: string;
  class?: string;
  section?: string;
  roll_number?: string;
  allergies: string[];
  is_active: boolean;
  photo_url?: string;
}

export interface ListResponse<T> {
  data: T;
}

export interface MenuItemDto {
  item_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  nutrition?: Record<string, unknown> | null;
  allergens: string[];
  availability?: Record<string, unknown> | null;
  image_url?: string;
}

export interface MenuCategoryDto {
  category_id: string;
  name: string;
  type: string;
  description?: string;
  items: MenuItemDto[];
}

export interface MenuResponse {
  data: MenuCategoryDto[];
  meta: {
    service_date?: string;
  };
}

export interface OrderLine {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  preferences?: string[];
}

export interface OrderSummary {
  order_id: string;
  school_id: string;
  student_id: string;
  status: string;
  payment_status: string;
  service_date: string;
  total_amount: number;
  currency: string;
  items: OrderLine[];
}

export interface OrdersResponse {
  data: OrderSummary[];
}
