import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { StoreService } from '../store/store.service';

class GoldRateDto {
  @IsString() purity!: string;
  @IsNumber() ratePerGram!: number;
  @IsString() updatedBy!: string;
}

@Controller('api/gold-rates')
export class GoldRatesController {
  constructor(private readonly store: StoreService) {}

  @Get('latest')
  latest() {
    return this.store.goldRates;
  }

  @Get('history')
  history() {
    return [...this.store.goldRates].sort((a, b) =>
      b.effectiveDate.localeCompare(a.effectiveDate),
    );
  }

  @Post()
  create(@Body() dto: GoldRateDto) {
    const row = {
      ...dto,
      id: crypto.randomUUID(),
      source: 'Manual',
      effectiveDate: new Date().toISOString(),
    };
    this.store.goldRates.push(row);
    return row;
  }
}
