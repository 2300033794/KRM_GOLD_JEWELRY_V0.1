import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDeliveryDto } from './dto';

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.delivery.findMany({
      include: {
        order: {
          include: {
            customer: {
              select: { id: true, name: true, email: true, phone: true },
            },
            items: { include: { product: true } },
            address: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getByOrderId(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            customer: {
              select: { id: true, name: true, email: true, phone: true },
            },
            items: { include: { product: true } },
            address: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  async update(id: string, dto: UpdateDeliveryDto, updatedById: string) {
    const existing = await this.prisma.delivery.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Delivery not found');
    }

    const updateData: Prisma.DeliveryUpdateInput = {
      courierName: dto.courierName,
      trackingId: dto.trackingId,
      status: dto.status,
      updatedBy: { connect: { id: updatedById } },
      ...(dto.estimatedDate
        ? { estimatedDate: new Date(dto.estimatedDate) }
        : {}),
      ...(dto.status === DeliveryStatus.DELIVERED
        ? { deliveredAt: new Date() }
        : {}),
    };

    if (dto.estimatedDate) {
      const parsedDate = new Date(dto.estimatedDate);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid estimatedDate');
      }
    }

    return this.prisma.delivery.update({
      where: { id },
      data: updateData,
      include: {
        order: {
          include: {
            customer: {
              select: { id: true, name: true, email: true, phone: true },
            },
            items: { include: { product: true } },
            address: true,
          },
        },
      },
    });
  }
}
