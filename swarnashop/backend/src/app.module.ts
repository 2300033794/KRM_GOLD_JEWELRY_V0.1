import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { GoldRatesModule } from './gold-rates/gold-rates.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { AuditService } from './audit/audit.service';
import { UploadService } from './upload/upload.service';
import { NotificationsService } from './notifications/notifications.service';
import { StoreModule } from './store/store.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StoreModule,
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    GoldRatesModule,
    OrdersModule,
    DeliveriesModule,
    PaymentsModule,
    UsersModule,
    ChatModule,
  ],
  providers: [AuditService, UploadService, NotificationsService],
})
export class AppModule {}
