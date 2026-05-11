import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RequestUser } from '../auth/auth.types';
import { CreateGoldRateDto } from './dto';
import { GoldRatesService } from './gold-rates.service';

@Controller('api/gold-rates')
export class GoldRatesController {
  constructor(private readonly goldRatesService: GoldRatesService) {}

  @Get('latest')
  async latest() {
    return this.goldRatesService.latest();
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async history() {
    return this.goldRatesService.history();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body() dto: CreateGoldRateDto,
    @Req() req: { user: RequestUser },
  ) {
    return this.goldRatesService.create(dto, req.user.id);
  }
}
