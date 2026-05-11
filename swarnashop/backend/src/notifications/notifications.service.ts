import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  sendOrderPlacedEmail(email: string, orderNumber: string) {
    return { sent: true, email, orderNumber, type: 'order_placed' };
  }

  sendWelcomeEmail(email: string) {
    return { sent: true, email, type: 'welcome' };
  }
}
