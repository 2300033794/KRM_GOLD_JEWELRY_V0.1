import { UploadService } from './upload.service';

describe('UploadService', () => {
  it('validates mime type and max size', () => {
    const service = new UploadService();
    expect(service.validateUpload('image/jpeg', 1024)).toBe(true);
    expect(service.validateUpload('image/gif', 1024)).toBe(false);
    expect(service.validateUpload('image/png', 6 * 1024 * 1024)).toBe(false);
  });
});
