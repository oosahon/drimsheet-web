export const EFileType = {
  Image: 'image/*',
  Jpg: 'image/jpg',
  Jpeg: 'image/jpeg',
  Png: 'image/png',
  Pdf: 'application/pdf',
  Svg: 'image/svg+xml',
} as const;

export type UFileType = (typeof EFileType)[keyof typeof EFileType];
