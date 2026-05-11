import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  image?: string;
}
export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  purity: string;
  weightGrams: number;
  makingCharge: number;
  wastagePerc: number;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  categoryId: string;
  images: Array<{
    id: string;
    url: string;
    publicId: string;
    isPrimary: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}
export interface GoldRateRecord {
  id: string;
  purity: string;
  ratePerGram: number;
  updatedBy: string;
  effectiveDate: string;
  source: string;
}
export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    finalPrice: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  addressId: string;
  createdAt: string;
  updatedAt: string;
}
export interface DeliveryRecord {
  id: string;
  orderId: string;
  status: string;
  courierName?: string;
  trackingId?: string;
  estimatedDate?: string;
  updatedAt: string;
}

@Injectable()
export class StoreService {
  users: UserRecord[] = [];
  categories: CategoryRecord[] = [
    { id: randomUUID(), name: 'Necklace', slug: 'necklace' },
    { id: randomUUID(), name: 'Ring', slug: 'ring' },
  ];
  products: ProductRecord[] = [];
  goldRates: GoldRateRecord[] = [
    {
      id: randomUUID(),
      purity: '24KT',
      ratePerGram: 7600,
      updatedBy: 'system',
      effectiveDate: new Date().toISOString(),
      source: 'Manual',
    },
    {
      id: randomUUID(),
      purity: '22KT',
      ratePerGram: 6980,
      updatedBy: 'system',
      effectiveDate: new Date().toISOString(),
      source: 'Manual',
    },
    {
      id: randomUUID(),
      purity: '18KT',
      ratePerGram: 5710,
      updatedBy: 'system',
      effectiveDate: new Date().toISOString(),
      source: 'Manual',
    },
  ];
  orders: OrderRecord[] = [];
  deliveries: DeliveryRecord[] = [];
  chatSessions: Array<{
    id: string;
    userId?: string;
    guestId?: string;
    messages: Array<{
      id: string;
      role: string;
      content: string;
      createdAt: string;
    }>;
  }> = [];
}
