import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import {
  MenuCategoryEntity,
  MenuItemEntity,
  OrderEntity,
  OrderItemEntity,
  ParentChildEntity,
  ParentEntity,
  PaymentEntity,
  SchoolSettingsEntity,
  StudentEntity,
} from '../../database/entities';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ParentEntity,
      ParentChildEntity,
      StudentEntity,
      MenuCategoryEntity,
      MenuItemEntity,
      OrderEntity,
      OrderItemEntity,
      PaymentEntity,
      SchoolSettingsEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
