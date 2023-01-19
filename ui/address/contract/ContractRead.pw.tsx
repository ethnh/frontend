import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as contractMethodsMock from 'mocks/contract/methods';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ContractRead from './ContractRead';

const addressHash = 'hash';
const CONTRACT_READ_METHODS_API_URL = buildApiUrl('contract_methods_read', { id: addressHash }) + '?is_custom_abi=false';
const CONTRACT_QUERY_METHOD_API_URL = buildApiUrl('contract_method_query', { id: addressHash });
const hooksConfig = {
  router: {
    query: { id: addressHash },
  },
};

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(CONTRACT_READ_METHODS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMethodsMock.read),
  }));
  await page.route(CONTRACT_QUERY_METHOD_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMethodsMock.readResultSuccess),
  }));

  const component = await mount(
    <TestApp>
      <ContractRead/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByText(/expand all/i).click();

  await expect(component).toHaveScreenshot();

  await component.getByPlaceholder(/address/i).type('address-hash');
  await component.getByText(/query/i).click();

  await component.getByText(/wei/i).click();

  await expect(component).toHaveScreenshot();
});

test('error result', async({ mount, page }) => {
  await page.route(CONTRACT_READ_METHODS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMethodsMock.read),
  }));
  await page.route(CONTRACT_QUERY_METHOD_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMethodsMock.readResultError),
  }));

  const component = await mount(
    <TestApp>
      <ContractRead/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByText(/expand all/i).click();
  await component.getByPlaceholder(/address/i).type('address-hash');
  await component.getByText(/query/i).click();

  const section = page.locator('section', { hasText: 'balanceOf' });

  await expect(section).toHaveScreenshot();
});
