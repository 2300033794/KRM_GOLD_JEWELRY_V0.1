import { Module } from '@nestjs/common';
import { GoldRatesController } from './gold-rates.controller';

@Module({ controllers: [GoldRatesController] })
export class GoldRatesModule {}
