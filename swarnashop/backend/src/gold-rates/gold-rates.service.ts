import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoldRateDto } from './dto';

@Injectable()
export class GoldRatesService {
  constructor(private readonly prisma: PrismaService) {}

  async latest() {
    const [rate24kt, rate22kt, rate18kt] = await this.prisma.$transaction([
      this.prisma.goldRate.findFirst({
        where: { purity: '24KT' },
        orderBy: { effectiveDate: 'desc' },
      }),
      this.prisma.goldRate.findFirst({
        where: { purity: '22KT' },
        orderBy: { effectiveDate: 'desc' },
      }),
      this.prisma.goldRate.findFirst({
        where: { purity: '18KT' },
        orderBy: { effectiveDate: 'desc' },
      }),
    ]);

    return {
      rate24kt: rate24kt?.ratePerGram ?? null,
      rate22kt: rate22kt?.ratePerGram ?? null,
      rate18kt: rate18kt?.ratePerGram ?? null,
      effectiveDate:
        rate24kt?.effectiveDate ??
        rate22kt?.effectiveDate ??
        rate18kt?.effectiveDate ??
        null,
    };
  }

  async create(dto: CreateGoldRateDto, updatedById: string) {
    const effectiveDate = new Date();
    const source = dto.source ?? 'Manual';

    const rates = await this.prisma.$transaction([
      this.prisma.goldRate.create({
        data: {
          purity: '24KT',
          ratePerGram: dto.rate24kt,
          source,
          effectiveDate,
          updatedById,
        },
      }),
      this.prisma.goldRate.create({
        data: {
          purity: '22KT',
          ratePerGram: dto.rate22kt,
          source,
          effectiveDate,
          updatedById,
        },
      }),
      this.prisma.goldRate.create({
        data: {
          purity: '18KT',
          ratePerGram: dto.rate18kt,
          source,
          effectiveDate,
          updatedById,
        },
      }),
    ]);

    return {
      effectiveDate,
      source,
      rates,
    };
  }

  async history() {
    return this.prisma.goldRate.findMany({
      orderBy: [{ effectiveDate: 'desc' }, { createdAt: 'desc' }],
    });
  }
}
