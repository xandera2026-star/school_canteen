import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { AuthModule } from '../auth/auth.module';
import {
  IdempotencyKeyEntity,
  MenuCategoryEntity,
  MenuItemEntity,
  OrderEntity,
  OrderItemEntity,
  ParentChildEntity,
  ParentEntity,
  PaymentEntity,
  StudentEntity,
} from '../../database/entities';
import { AuthModule } from '../auth/auth.module';

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
      IdempotencyKeyEntity,
    ]),
  ],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
