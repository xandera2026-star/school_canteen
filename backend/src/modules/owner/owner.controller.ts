import { Body, Controller, Get, Post } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SubscriptionDto } from './dto/subscription.dto';

@Controller({ path: 'owner', version: '1' })
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get('schools')
  listSchools() {
    return this.ownerService.listSchools();
  }

  @Post('schools')
  createSchool(@Body() payload: CreateSchoolDto) {
    return this.ownerService.createSchool(payload);
  }

  @Post('subscriptions')
  updateSubscription(@Body() payload: SubscriptionDto) {
    return this.ownerService.updateSubscription(payload);
  }
}
