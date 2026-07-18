import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const defaultProps = {
  title: 'Upload receipt or bank statement',
  description: 'Attach a file for this transaction.',
  actionText: 'Upload',
  accept: [EFileType.Image, EFileType.Pdf],
  onUpload: vi.fn(),
};

const imageFile = new File(['receipt'], 'receipt.png', {
  type: EFileType.Png,
  lastModified: new Date('2026-06-02').getTime(),
});

describe('DocumentUpload', () => {
  it('renders translated accepted file type labels below the empty state action', () => {
    render(<DocumentUpload {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(screen.getByText('Images & PDFs only')).toBeInTheDocument();
  });

  it('deduplicates translated accepted file type labels', () => {
    render(
      <DocumentUpload
        {...defaultProps}
        accept={[EFileType.Jpg, EFileType.Jpeg, EFileType.Png]}
      />
    );

    expect(screen.getByText('JPEGs & PNGs only')).toBeInTheDocument();
  });

  it('renders translated accepted file type labels below the multiple add action', () => {
    render(
      <DocumentUpload {...defaultProps} value={[imageFile]} allowMultiple />
    );

    expect(screen.getByRole('button', { name: /Upload/i })).toBeInTheDocument();
    expect(screen.getByText('Images & PDFs only')).toBeInTheDocument();
    expect(screen.getByText('receipt.png')).toBeInTheDocument();
  });

  it('does not render accepted file type labels when a single file is uploaded', () => {
    render(<DocumentUpload {...defaultProps} value={[imageFile]} />);

    expect(screen.queryByText('Images & PDFs only')).not.toBeInTheDocument();
    expect(screen.getByText('receipt.png')).toBeInTheDocument();
  });
});
