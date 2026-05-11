import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoldRateDto } from './dto';

@Injectable()
export class GoldRatesService {
  constructor(private readonly prisma: PrismaService) {}

  async latest() {
    const rates = await this.prisma.goldRate.findMany({
      where: { purity: { in: ['24KT', '22KT', '18KT'] } },
      orderBy: { effectiveDate: 'desc' },
    });

    return {
      rate24kt: rates.find((row) => row.purity === '24KT')?.ratePerGram ?? null,
      rate22kt: rates.find((row) => row.purity === '22KT')?.ratePerGram ?? null,
      rate18kt: rates.find((row) => row.purity === '18KT')?.ratePerGram ?? null,
      effectiveDate: rates[0]?.effectiveDate ?? null,
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
