export declare class SystemService {
    getIdempotencyStatus(key: string): {
        data: {
            key: string;
            status: string;
            response: {
                order_id: string;
                status: string;
            };
        };
    };
    generateUploadUrl(folder: string, mimeType: string): {
        data: {
            upload_url: string;
            file_url: string;
            mime_type: string;
        };
    };
}
