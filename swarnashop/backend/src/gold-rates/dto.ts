import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGoldRateDto {
  @IsNumber()
  rate24kt!: number;

  @IsNumber()
  rate22kt!: number;

  @IsNumber()
  rate18kt!: number;

  @IsOptional()
  @IsString()
  source?: string;
}
