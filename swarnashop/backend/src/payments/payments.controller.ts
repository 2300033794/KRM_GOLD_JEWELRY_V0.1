import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/payments')
export class PaymentsController {
  @Post('create-order')
  createOrder(@Body() body: { amount: number; currency?: string }) {
    return {
      id: `order_${Date.now()}`,
      amount: body.amount,
      currency: body.currency ?? 'INR',
      provider: 'razorpay',
    };
  }

  @Post('verify')
  verify(
    @Body()
    body: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
  ) {
    return {
      verified: Boolean(
        body.razorpay_payment_id &&
        body.razorpay_order_id &&
        body.razorpay_signature,
      ),
    };
  }
}
