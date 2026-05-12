import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() body: CreatePaymentOrderDto) {
    return this.paymentsService.createOrder(body);
  }

  @Post('verify')
  verify(@Body() body: VerifyPaymentDto) {
    return this.paymentsService.verifySignature(body);
  }
}
