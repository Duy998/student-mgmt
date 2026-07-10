import { request } from '@playwright/test';
import { ENV } from '../constants/env';

export async function createApiContext() {
  return await request.newContext({
    baseURL: ENV.api.baseUrl,

    extraHTTPHeaders: {
      Accept: 'application/json',
      'x-api-key': ENV.api.adminApiSecret,
    },
  });
}