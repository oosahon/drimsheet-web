const localStorageService = {
  setAccountingEntityId(id: string) {
    localStorage.setItem('accounting-entity-id', id);
  },

  getAccountingEntityId() {
    return localStorage.getItem('accounting-entity-id');
  },
};
export default localStorageService;
