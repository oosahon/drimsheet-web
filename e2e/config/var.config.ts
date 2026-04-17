import { config } from 'dotenv';

config({ path: '.env.test' });

export const { API_URL, WEB_URL } = process.env as Record<string, string>;
