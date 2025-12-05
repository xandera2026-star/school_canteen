import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SystemService } from './system.service';
import { UploadRequestDto } from './dto/upload-request.dto';

@Controller({ path: '', version: '1' })
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('idempotency')
  idempotency(@Query('key') key: string) {
    return this.systemService.getIdempotencyStatus(key);
  }

  @Post('upload-url')
  uploadUrl(@Body() payload: UploadRequestDto) {
    return this.systemService.generateUploadUrl(
      payload.folder,
      payload.mime_type,
    );
  }
}
