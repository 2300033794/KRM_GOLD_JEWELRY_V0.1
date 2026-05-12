import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { RequestUser } from '../auth/auth.types';
import { DeliveriesService } from './deliveries.service';
import { UpdateDeliveryDto } from './dto';

@Controller('api/deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  list() {
    return this.deliveriesService.list();
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  detail(@Param('orderId') orderId: string) {
    return this.deliveriesService.getByOrderId(orderId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryDto,
    @Req() req: { user: RequestUser },
  ) {
    return this.deliveriesService.update(id, body, req.user.id);
  }
}
