import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  getIdempotencyStatus(key: string) {
    return {
      data: {
        key,
        status: 'replayed',
        response: { order_id: 'order-placeholder', status: 'confirmed' },
      },
    };
  }

  generateUploadUrl(folder: string, mimeType: string) {
    return {
      data: {
        upload_url: `https://storage.googleapis.com/mock/${folder}/upload-url`,
        file_url: `https://cdn.xandera.com/${folder}/${Date.now()}`,
        mime_type: mimeType,
      },
    };
  }
}
