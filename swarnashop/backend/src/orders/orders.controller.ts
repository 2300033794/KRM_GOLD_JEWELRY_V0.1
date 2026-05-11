import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { StoreService } from '../store/store.service';

class CreateOrderDto {
  @IsString() customerId!: string;
  @IsString() addressId!: string;
  @IsArray() items!: Array<{
    productId: string;
    quantity: number;
    finalPrice: number;
  }>;
  @IsNumber() totalAmount!: number;
}

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly store: StoreService) {}

  @Get()
  all() {
    return this.store.orders;
  }

  @Get('my')
  my(@Req() req: { user?: { id?: string } }) {
    return this.store.orders.filter((o) => o.customerId === req.user?.id);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return (
      this.store.orders.find((o) => o.id === id) ?? { message: 'Not found' }
    );
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    const order = {
      id: crypto.randomUUID(),
      orderNumber: `KMR-${Date.now()}`,
      customerId: dto.customerId,
      items: dto.items.map((i) => ({ ...i, id: crypto.randomUUID() })),
      totalAmount: dto.totalAmount,
      status: 'PLACED',
      paymentStatus: 'PENDING',
      addressId: dto.addressId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.orders.push(order);
    return order;
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const order = this.store.orders.find((o) => o.id === id);
    if (!order) return { message: 'Not found' };
    order.status = body.status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.store.orders = this.store.orders.filter((o) => o.id !== id);
    return { success: true };
  }
}
