import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/modules/users/users.module';
import { LikesModule } from '@/modules/likes/likes.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItemOptionsModule } from '@/modules/menu.item.options/menu.item.options.module';
import { MenuItemsModule } from '@/modules/menu.items/menu.items.module';
import { MenusModule } from '@/modules/menus/menus.module';
import { OrderDetailModule } from '@/modules/order.detail/order.detail.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    LikesModule,
    MenuItemOptionsModule,
    MenuItemsModule,
    MenusModule,
    OrderDetailModule,
    OrdersModule,
    RestaurantsModule,
    ReviewsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://localhost:27017',
        dbName: config.get<string>('MONGODB_DB') || 'ka_food',
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
