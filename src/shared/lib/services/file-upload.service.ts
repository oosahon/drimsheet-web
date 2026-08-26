import { drimsheetApi } from '@/shared/lib/api';
import type { IFileAttachment } from '@/shared/lib/api/Api';
import axios from 'axios';

async function uploadFile(file: File): Promise<IFileAttachment> {
  const uploadInstructionResponse = await drimsheetApi.files.createFileUpload({
    name: file.name,
    type: file.type,
    size: file.size,
  });
  const uploadInstruction = uploadInstructionResponse.data;

  await axios.put(uploadInstruction.uploadUrl, file, {
    headers: uploadInstruction.headers,
  });

  return uploadInstruction.file;
}

export const fileUploadService = Object.freeze({
  uploadFile,
});
