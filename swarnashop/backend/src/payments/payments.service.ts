import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto';

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new InternalServerErrorException('Razorpay configuration is missing');
  }

  return { keyId, keySecret };
}

@Injectable()
export class PaymentsService {
  private readonly client: Razorpay;
  private readonly keySecret: string;

  constructor() {
    const { keyId, keySecret } = getRazorpayConfig();
    this.keySecret = keySecret;
    this.client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  async createOrder(dto: CreatePaymentOrderDto) {
    const amountInPaise = Math.round(dto.amount * 100);
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    return this.client.orders.create({
      amount: amountInPaise,
      currency: dto.currency ?? 'INR',
      receipt: dto.receipt ?? `receipt_${Date.now()}`,
      payment_capture: dto.capture ?? true,
    });
  }

  verifySignature(dto: VerifyPaymentDto) {
    const payload = `${dto.razorpay_order_id}|${dto.razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');

    return { verified: expected === dto.razorpay_signature };
  }
}
