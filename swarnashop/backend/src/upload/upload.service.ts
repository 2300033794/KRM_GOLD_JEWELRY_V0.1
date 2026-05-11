import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  maxBytes = 5 * 1024 * 1024;

  validateUpload(mimeType: string, size: number): boolean {
    return this.allowedMime.includes(mimeType) && size <= this.maxBytes;
  }
}
