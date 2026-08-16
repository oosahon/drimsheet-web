import { drimsheetApi } from '@/shared/lib/api';

export const userService = {
  async getProfile() {
    const res = await drimsheetApi.users.getAuthUserProfile();
    return res.data;
  },

  async getPreferences() {
    const res = await drimsheetApi.users.getUserPreferences();
    window.localStorage.setItem('preferences', JSON.stringify(res.data));

    return res.data;
  },
};
