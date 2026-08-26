import { drimsheetApi } from '@/shared/lib/api';
import type { IFileUploadDto } from '@/shared/lib/api/Api';
import { fileUploadService } from '@/shared/lib/services/file-upload.service';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib/api', () => ({
  drimsheetApi: {
    files: {
      createFileUpload: vi.fn(),
    },
  },
}));

vi.mock('axios', () => ({
  default: {
    put: vi.fn(),
  },
}));

const uploadInstruction = {
  uploadUrl: 'https://uploads.example.com/file?signature=secret',
  headers: {
    'Content-Type': 'image/png',
  },
  file: {
    url: 'https://uploads.example.com/file',
    name: 'receipt.png',
    type: 'image/png',
    size: 12,
  },
} satisfies IFileUploadDto;

describe('fileUploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads a browser file directly with the Core-issued instruction', async () => {
    const file = new File(['file-content'], 'receipt.png', {
      type: 'image/png',
    });
    vi.mocked(drimsheetApi.files.createFileUpload).mockResolvedValue({
      data: uploadInstruction,
    } as never);
    vi.mocked(axios.put).mockResolvedValue({} as never);

    await expect(fileUploadService.uploadFile(file)).resolves.toEqual(
      uploadInstruction.file
    );

    expect(drimsheetApi.files.createFileUpload).toHaveBeenCalledWith({
      name: 'receipt.png',
      type: 'image/png',
      size: file.size,
    });
    expect(axios.put).toHaveBeenCalledWith(uploadInstruction.uploadUrl, file, {
      headers: uploadInstruction.headers,
    });
  });

  it('does not contact Blackblaze when Core cannot create an upload instruction', async () => {
    const coreError = new Error('Core unavailable');
    const file = new File(['file-content'], 'receipt.png', {
      type: 'image/png',
    });
    vi.mocked(drimsheetApi.files.createFileUpload).mockRejectedValue(coreError);

    await expect(fileUploadService.uploadFile(file)).rejects.toBe(coreError);
    expect(axios.put).not.toHaveBeenCalled();
  });

  it('rejects without returning metadata when the direct upload fails', async () => {
    const uploadError = new Error('Blackblaze unavailable');
    const file = new File(['file-content'], 'receipt.png', {
      type: 'image/png',
    });
    vi.mocked(drimsheetApi.files.createFileUpload).mockResolvedValue({
      data: uploadInstruction,
    } as never);
    vi.mocked(axios.put).mockRejectedValue(uploadError);

    await expect(fileUploadService.uploadFile(file)).rejects.toBe(uploadError);
  });
});
