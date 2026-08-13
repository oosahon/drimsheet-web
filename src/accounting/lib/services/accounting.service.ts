import { purpleLedgerApi } from '@/shared/lib/api';
import type {
  IAccountingEntity,
  IAccountingEntityCreationDto,
  IAccountingEntitySwitchReq,
} from '@/shared/lib/api/Api';
import { parseApiError } from '@/shared/lib/api/errors';

const accountingEntityReloadKey = 'accounting-entity-id';
let reloadAccountingEntityId =
  localStorage.getItem(accountingEntityReloadKey) ?? undefined;
localStorage.removeItem(accountingEntityReloadKey);

let activeAccountingEntity: IAccountingEntity | undefined;

function setActiveAccountingEntity(accountingEntity: IAccountingEntity) {
  activeAccountingEntity = accountingEntity;
  reloadAccountingEntityId = undefined;
}

export const accountingService = {
  getAccountingEntityId() {
    return activeAccountingEntity?.id ?? reloadAccountingEntityId;
  },

  removeAccountingEntity() {
    activeAccountingEntity = undefined;
    reloadAccountingEntityId = undefined;
    localStorage.removeItem(accountingEntityReloadKey);
  },

  prepareAccountingEntityReload() {
    const accountingEntityId = this.getAccountingEntityId();
    if (!accountingEntityId) return;

    localStorage.setItem(accountingEntityReloadKey, accountingEntityId);
  },

  async getAccountingEntities() {
    const res = await purpleLedgerApi.accounting.getUserAccountingEntities();
    return res.data;
  },

  async getAccountingEntity() {
    try {
      const res = await purpleLedgerApi.accounting.getActiveAccountingEntity();
      setActiveAccountingEntity(res.data);
      return res.data;
    } catch (error) {
      if (parseApiError(error).code !== 404) throw error;

      const [firstAccountingEntity] = await this.getAccountingEntities();
      if (!firstAccountingEntity) throw error;

      return this.switchAccountingEntity({
        accountingEntityId: firstAccountingEntity.id,
      });
    }
  },

  async switchAccountingEntity(payload: IAccountingEntitySwitchReq) {
    const res =
      await purpleLedgerApi.accounting.switchAccountingEntity(payload);
    setActiveAccountingEntity(res.data);
    return res.data;
  },

  async getJurisdiction() {
    const res = await purpleLedgerApi.accounting.getJurisdictions();
    return res.data;
  },

  async createAccountingEntity(payload: IAccountingEntityCreationDto) {
    const { data } =
      await purpleLedgerApi.accounting.createAccountingEntity(payload);

    setActiveAccountingEntity(data);
    return data;
  },
};
