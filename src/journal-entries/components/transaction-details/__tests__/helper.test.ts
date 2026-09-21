import transactionDetailsHelpers from '@/journal-entries/components/transaction-details/helper';
import { describe, expect, it } from 'vitest';

describe('transactionDetailsHelpers', () => {
  it('formats attachment sizes for bytes, kilobytes, and megabytes', () => {
    expect(transactionDetailsHelpers.formatFileSize(950)).toBe('950 B');
    expect(transactionDetailsHelpers.formatFileSize(2048)).toBe('2 KB');
    expect(transactionDetailsHelpers.formatFileSize(1_572_864)).toBe('1.5 MB');
  });
});
