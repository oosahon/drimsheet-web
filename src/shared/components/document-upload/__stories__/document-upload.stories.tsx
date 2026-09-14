import '@/_app/i18n/config';
import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';

const imageFile = new File(
  [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#f7f7f7"/><path d="M8 10h24M8 20h24M8 30h24M12 6v28M28 6v28" stroke="#d4a373" stroke-width="1.5"/></svg>',
  ],
  'Screenshot 2026-06-02 at 06.58.29.png',
  {
    type: 'image/svg+xml',
    lastModified: new Date('2026-06-02').getTime(),
  }
);

const pdfFile = new File(['statement'], 'bank-statement-may.pdf', {
  type: 'application/pdf',
  lastModified: new Date('2026-05-31').getTime(),
});

const meta = {
  title: 'Shared UI/DocumentUpload',
  component: DocumentUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[820px] bg-background p-8 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Upload receipt or bank statement (recommended)',
    description:
      'We accept images and PDFs. Make sure to include the date and amount in the file.',
    actionText: 'Upload',
    accept: [EFileType.Image, EFileType.Pdf],
    onUpload: () => undefined,
  },
} satisfies Meta<typeof DocumentUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);

    return <DocumentUpload {...args} value={files} onUpload={setFiles} />;
  },
};

export const CustomMedia: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <DocumentUpload
        {...args}
        value={files}
        media={<UploadCloud />}
        onUpload={setFiles}
      />
    );
  },
};

export const SingleUploaded: Story = {
  render: (args) => (
    <DocumentUpload {...args} value={[imageFile]} onUpload={() => undefined} />
  ),
};

export const MultipleUploaded: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([imageFile, pdfFile]);

    return (
      <DocumentUpload
        {...args}
        value={files}
        allowMultiple
        onUpload={setFiles}
      />
    );
  },
};
