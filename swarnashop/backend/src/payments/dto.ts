import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentOrderDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  receipt?: string;
}

export class VerifyPaymentDto {
  @IsString()
  razorpay_payment_id!: string;

  @IsString()
  razorpay_order_id!: string;

  @IsString()
  razorpay_signature!: string;
}
