import { SystemService } from './system.service';
import { UploadRequestDto } from './dto/upload-request.dto';
export declare class SystemController {
    private readonly systemService;
    constructor(systemService: SystemService);
    idempotency(key: string): {
        data: {
            key: string;
            status: string;
            response: {
                order_id: string;
                status: string;
            };
        };
    };
    uploadUrl(payload: UploadRequestDto): {
        data: {
            upload_url: string;
            file_url: string;
            mime_type: string;
        };
    };
}
