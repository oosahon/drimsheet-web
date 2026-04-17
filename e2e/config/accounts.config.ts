import { config } from 'dotenv';
import {
  USER_ACCOUNT_EXISTING,
  USER_ACCOUNT_FIRST_TIMER,
  USER_ACCOUNT_UN_ONBOARDED,
  USER_FIRST_NAME,
  USER_LAST_NAME,
  USER_PASSWORD,
} from './var.seed';

config({ path: '.env.test' });

export const userAccounts = {
  existing: {
    firstName: USER_FIRST_NAME,
    lastName: USER_LAST_NAME,
    email: USER_ACCOUNT_EXISTING,
    password: USER_PASSWORD,
  },
  firstTimer: {
    firstName: USER_FIRST_NAME,
    lastName: USER_LAST_NAME,
    email: USER_ACCOUNT_FIRST_TIMER,
    password: USER_PASSWORD,
  },
  unOnboarded: {
    firstName: USER_FIRST_NAME,
    lastName: USER_LAST_NAME,
    email: USER_ACCOUNT_UN_ONBOARDED,
    password: USER_PASSWORD,
  },
};
