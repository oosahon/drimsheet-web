import { drimsheetApi } from '@/shared/lib/api';
import { EFileUploadPurpose } from '@/shared/lib/api/Api';
import axios from 'axios';

async function uploadFile(file: File): Promise<string> {
  const uploadInstructionResponse = await drimsheetApi.files.preSignUploads([
    {
      name: file.name,
      type: file.type,
      size: file.size,
      purpose: EFileUploadPurpose.JournalEntryAttachment,
    },
  ]);
  const uploadInstruction = uploadInstructionResponse.data[0];

  if (!uploadInstruction) throw new Error('Missing file upload instruction');

  await axios.put(uploadInstruction.uploadUrl, file, {
    headers: uploadInstruction.headers,
  });

  return uploadInstruction.reference;
}

export const fileUploadService = Object.freeze({
  uploadFile,
});
