import type {
  IContractorFormValues,
  ICounterpartyFormValues,
  IEmployerFormValues,
  IVendorFormValues,
} from '@/counterparty/components';
import { ECounterpartyStatus } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';
import { counterpartyMapper } from './counterparty.mapper';

describe('counterparty.mapper', () => {
  describe('toCounterpartyCreateReq', () => {
    it('maps counterparty form values to DTO', () => {
      const values: ICounterpartyFormValues = {
        name: 'John Doe',
        type: 'individual',
      };
      const result = counterpartyMapper.toCounterpartyCreateReq(values);
      expect(result).toEqual({
        name: 'John Doe',
        type: 'individual',
        status: ECounterpartyStatus.Active,
      });
    });
  });

  describe('toVendorCreateReq', () => {
    it('maps vendor form values without address to DTO', () => {
      const values: IVendorFormValues = {
        name: 'Acme Corp',
        type: 'organization',
        displayName: 'Acme',
        address: {},
      };
      const result = counterpartyMapper.toVendorCreateReq(values);
      expect(result).toEqual({
        name: 'Acme Corp',
        type: 'organization',
        status: ECounterpartyStatus.Active,
        address: undefined,
      });
    });

    it('maps vendor form values with address to DTO', () => {
      const values: IVendorFormValues = {
        name: 'Acme Corp',
        type: 'organization',
        displayName: 'Acme',
        address: {
          line1: '123 Main St',
          city: 'Lagos',
          countryCode: 'NG',
        },
      };
      const result = counterpartyMapper.toVendorCreateReq(values);
      expect(result).toEqual({
        name: 'Acme Corp',
        type: 'organization',
        status: ECounterpartyStatus.Active,
        address: {
          line1: '123 Main St',
          line2: undefined,
          city: 'Lagos',
          region: undefined,
          countryCode: 'NG',
        },
      });
    });
  });

  describe('toContractorCreateReq', () => {
    it('maps contractor form values to DTO, ignoring displayName', () => {
      const values: IContractorFormValues = {
        name: 'Jane Smith',
        type: 'individual',
        displayName: 'Jane Special name',
        address: {
          line1: '456 side road',
          city: 'Abuja',
          countryCode: 'NG',
        },
      };
      const result = counterpartyMapper.toContractorCreateReq(values);
      expect(result).toEqual({
        name: 'Jane Smith',
        type: 'individual',
        status: ECounterpartyStatus.Active,
        address: {
          line1: '456 side road',
          line2: undefined,
          city: 'Abuja',
          region: undefined,
          countryCode: 'NG',
        },
      });
    });
  });

  describe('toEmployerCreateReq', () => {
    it('maps employer form values with displayName to DTO', () => {
      const values: IEmployerFormValues = {
        name: 'Tech Inc',
        type: 'organization',
        displayName: 'Tech LLC',
        address: {
          line1: '789 Business Blvd',
          city: 'Ibadan',
          countryCode: 'NG',
        },
      };
      const result = counterpartyMapper.toEmployerCreateReq(values);
      expect(result).toEqual({
        name: 'Tech Inc',
        type: 'organization',
        status: ECounterpartyStatus.Active,
        displayName: 'Tech LLC',
        address: {
          line1: '789 Business Blvd',
          line2: undefined,
          city: 'Ibadan',
          region: undefined,
          countryCode: 'NG',
        },
      });
    });

    it('maps employer form values without displayName to DTO', () => {
      const values: IEmployerFormValues = {
        name: 'Tech Inc',
        type: 'organization',
        address: {
          line1: '789 Business Blvd',
          city: 'Ibadan',
          countryCode: 'NG',
        },
      };
      const result = counterpartyMapper.toEmployerCreateReq(values);
      expect(result).toEqual({
        name: 'Tech Inc',
        type: 'organization',
        status: ECounterpartyStatus.Active,
        displayName: null,
        address: {
          line1: '789 Business Blvd',
          line2: undefined,
          city: 'Ibadan',
          region: undefined,
          countryCode: 'NG',
        },
      });
    });
  });
});
