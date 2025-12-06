export declare class OtpService {
    private readonly cache;
    private readonly ttlMs;
    issue(channelKey: string): string;
    verify(channelKey: string, otp: string): void;
}
