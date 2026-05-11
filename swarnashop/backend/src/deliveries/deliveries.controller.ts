import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { StoreService } from '../store/store.service';

@Controller('api/deliveries')
export class DeliveriesController {
  constructor(private readonly store: StoreService) {}

  @Get()
  list() {
    return this.store.deliveries;
  }

  @Get(':orderId')
  detail(@Param('orderId') orderId: string) {
    return (
      this.store.deliveries.find((d) => d.orderId === orderId) ?? {
        message: 'Not found',
      }
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      status?: string;
      courierName?: string;
      trackingId?: string;
      estimatedDate?: string;
    },
  ) {
    const delivery = this.store.deliveries.find((d) => d.id === id);
    if (!delivery) return { message: 'Not found' };
    Object.assign(delivery, body, { updatedAt: new Date().toISOString() });
    return delivery;
  }
}
