import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DeliveryStatus,
  OrderStatus,
  Prisma,
  Role,
  type Product,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../auth/auth.types';
import { CreateOrderDto, OrderListQueryDto } from './dto';

function getGstPercent(): number {
  const raw = process.env.GST_PERCENT ?? '3';
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new InternalServerErrorException(
      'GST_PERCENT must be a non-negative number',
    );
  }
  return parsed;
}

function calculateItemPrice(
  product: Product,
  goldRate: number,
  gstPerc: number,
) {
  const goldValue = product.weightGrams * goldRate;
  const makingAmt = goldValue * (product.makingCharge / 100);
  const wastageAmt = goldValue * (product.wastagePerc / 100);
  const subtotal = goldValue + makingAmt + wastageAmt;
  const gstAmt = subtotal * (gstPerc / 100);
  return subtotal + gstAmt;
}

@Injectable()
export class OrdersService {
  private readonly gstPerc = getGstPercent();

  constructor(private readonly prisma: PrismaService) {}

  async list(query: OrderListQueryDto) {
    const createdAt: Prisma.DateTimeFilter = {};
    if (query.startDate) {
      const start = new Date(query.startDate);
      if (Number.isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startDate');
      }
      createdAt.gte = start;
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      if (Number.isNaN(end.getTime())) {
        throw new BadRequestException('Invalid endDate');
      }
      createdAt.lte = end;
    }

    const where: Prisma.OrderWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
    };

    return this.prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        delivery: true,
        address: true,
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listByCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        items: { include: { product: true } },
        delivery: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, user: RequestUser) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        delivery: true,
        address: true,
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (user.role === Role.CUSTOMER && order.customerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async create(dto: CreateOrderDto, customerId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId: customerId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missing = productIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Products not found: ${missing.join(', ')}`);
    }

    const rateCache = new Map<string, number>();
    const itemsData = await Promise.all(
      dto.items.map(async (item) => {
        const product = products.find((value) => value.id === item.productId);
        if (!product) {
          throw new NotFoundException(`Product not found: ${item.productId}`);
        }

        let goldRate = rateCache.get(product.purity);
        if (goldRate === undefined) {
          const rateRecord = await this.prisma.goldRate.findFirst({
            where: { purity: product.purity },
            orderBy: { effectiveDate: 'desc' },
          });
          if (!rateRecord) {
            throw new BadRequestException(
              `Missing gold rate for purity ${product.purity}`,
            );
          }
          goldRate = rateRecord.ratePerGram;
          rateCache.set(product.purity, goldRate);
        }

        const finalPrice = calculateItemPrice(product, goldRate, this.gstPerc);

        return {
          productId: product.id,
          quantity: item.quantity,
          weightGrams: product.weightGrams,
          goldRateUsed: goldRate,
          makingCharge: product.makingCharge,
          wastagePerc: product.wastagePerc,
          gstPerc: this.gstPerc,
          finalPrice,
        };
      }),
    );

    const totalAmount = itemsData.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );

    const orderPrefix = process.env.ORDER_NUMBER_PREFIX ?? 'KRM';
    const orderSuffix = randomUUID().split('-')[0];
    const orderNumber = `${orderPrefix}-${orderSuffix}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        addressId: dto.addressId,
        totalAmount,
        notes: dto.notes,
        items: { create: itemsData },
        delivery: { create: { status: DeliveryStatus.PENDING } },
      },
      include: {
        items: { include: { product: true } },
        delivery: true,
        address: true,
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.ensureOrderExists(id);
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        delivery: true,
        address: true,
      },
    });
  }

  async cancel(id: string) {
    await this.ensureOrderExists(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        delivery: {
          upsert: {
            create: {
              status: DeliveryStatus.FAILED,
              notes: 'Order cancelled before fulfillment',
            },
            update: {
              status: DeliveryStatus.FAILED,
              notes: 'Order cancelled before fulfillment',
            },
          },
        },
      },
      include: {
        items: { include: { product: true } },
        delivery: true,
        address: true,
      },
    });
  }

  private async ensureOrderExists(id: string) {
    const exists = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Order not found');
    }
  }
}
