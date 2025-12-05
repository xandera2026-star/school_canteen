import { Injectable, UnauthorizedException } from '@nestjs/common';

interface OtpRecord {
  code: string;
  expiresAt: number;
}

@Injectable()
export class OtpService {
  private readonly cache = new Map<string, OtpRecord>();
  private readonly ttlMs = Number(process.env.OTP_TTL_MS ?? 5 * 60 * 1000);

  issue(channelKey: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.cache.set(channelKey, { code, expiresAt: Date.now() + this.ttlMs });
    return code;
  }

  verify(channelKey: string, otp: string) {
    const entry = this.cache.get(channelKey);
    if (!entry || entry.code !== otp || entry.expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    this.cache.delete(channelKey);
  }
}
