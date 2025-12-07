export interface DashboardTopItem {
  name: string;
  count: number;
}

export interface DashboardMissingStudent {
  student_id: string;
  name: string;
  class?: string;
  section?: string;
}

export interface DashboardResponse {
  data: {
    date: string;
    orders_today: number;
    gpay_total: number;
    cash_total: number;
    top_items: DashboardTopItem[];
    missing_students: DashboardMissingStudent[];
    school_name?: string;
  };
}

export interface MenuCategory {
  category_id: string;
  name: string;
  type: string;
  description?: string;
}

export interface MenuItem {
  item_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category_id: string;
  category_name?: string;
  allergens?: string[];
  is_active: boolean;
  availability?: Record<string, unknown> | null;
  image_url?: string;
}

export interface ListResponse<T> {
  data: T;
}

export interface AdminOrderLine {
  menu_item_id: string;
  name: string;
  quantity: number;
}

export interface AdminOrder {
  order_id: string;
  student_id: string;
  student_name?: string;
  class?: string;
  section?: string;
  parent_id: string;
  parent_name?: string;
  parent_mobile?: string;
  status: string;
  payment_status: string;
  service_date: string;
  total_amount: number;
  currency: string;
  items: AdminOrderLine[];
}

export interface ImportStats {
  import_id: string;
  processed: number;
  students_created: number;
  students_updated: number;
  parents_created: number;
}
