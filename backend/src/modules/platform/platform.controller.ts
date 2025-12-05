import { Controller, Get } from '@nestjs/common';
import { PlatformService } from './platform.service';

@Controller({ path: 'platform', version: '1' })
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('overview')
  overview() {
    return this.platformService.overview();
  }
}
