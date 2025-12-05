export enum SubscriptionPlan {
  TRIAL = 'trial',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum MenuCategoryType {
  VEG = 'veg',
  NON_VEG = 'non_veg',
  SNACKS = 'snacks',
  SOUTH_INDIAN = 'south_indian',
  NORTH_INDIAN = 'north_indian',
  SPECIAL = 'special',
  DRINKS = 'drinks',
}

export enum AllergyFlag {
  NUTS = 'nuts',
  GLUTEN = 'gluten',
  LACTOSE = 'lactose',
  SPICY = 'spicy',
}
