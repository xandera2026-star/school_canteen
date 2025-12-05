import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ParentModule } from './modules/parent/parent.module';
import { AdminModule } from './modules/admin/admin.module';
import { OwnerModule } from './modules/owner/owner.module';
import { PlatformModule } from './modules/platform/platform.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ParentModule,
    AdminModule,
    OwnerModule,
    PlatformModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
