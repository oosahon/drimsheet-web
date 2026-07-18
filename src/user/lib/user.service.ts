import purpleLedgerApi from '@/shared/lib/api';

const userService = {
  async getProfile() {
    const res = await purpleLedgerApi.users.getAuthUserProfile();
    return res.data;
  },

  async getPreferences() {
    const res = await purpleLedgerApi.users.getUserPreferences();
    window.localStorage.setItem('preferences', JSON.stringify(res.data));

    return res.data;
  },
};

export default userService;
