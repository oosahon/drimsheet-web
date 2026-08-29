export interface FileUploadProps {
  accept: string[];
  actionText: string;
  description: string;
  disabled?: boolean;
  errors?: Array<{ message?: string } | undefined>;
  id: string;
  label: string;
  onValueChange: (file: File | null) => void;
  removeText: string;
  replaceText: string;
  value: File | null;
}
