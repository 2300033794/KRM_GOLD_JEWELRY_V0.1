import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @IsOptional()
  @IsString()
  courierName?: string;

  @IsOptional()
  @IsString()
  trackingId?: string;

  @IsOptional()
  @IsDateString()
  estimatedDate?: string;
}
