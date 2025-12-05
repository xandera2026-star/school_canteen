import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'xandera-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
