import { Button } from '@/shared/components/button';
import { Field, FieldDescription, FieldError } from '@/shared/components/field';
import { Label } from '@/shared/components/label';
import { Upload, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import type { FileUploadProps } from './types';

export function FileUpload({
  accept,
  actionText,
  description,
  disabled = false,
  errors,
  id,
  label,
  onValueChange,
  removeText,
  replaceText,
  value,
}: Readonly<FileUploadProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const invalid = Boolean(errors?.length);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const handleOpenPicker = () => {
    inputRef.current?.click();
  };

  return (
    <Field data-invalid={invalid}>
      <Label htmlFor={id}>{label}</Label>
      <input
        ref={inputRef}
        id={id}
        accept={accept.join(',')}
        aria-invalid={invalid}
        className="sr-only"
        disabled={disabled}
        onChange={handleInputChange}
        type="file"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={disabled}
          onClick={handleOpenPicker}
          size="sm"
          type="button"
          variant="secondary"
        >
          <Upload />
          {value ? replaceText : actionText}
        </Button>
        {value && (
          <span className="max-w-xs truncate text-sm">{value.name}</span>
        )}
        {value && (
          <Button
            aria-label={removeText}
            disabled={disabled}
            onClick={() => onValueChange(null)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        )}
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError errors={errors} />
    </Field>
  );
}
