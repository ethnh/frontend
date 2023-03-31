import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as contractMock from 'mocks/contract/info';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ContractCode from './ContractCode';

const addressHash = 'hash';
const CONTRACT_API_URL = buildApiUrl('contract', { hash: addressHash });
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

test('verified with changed byte code +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withChangedByteCode),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('verified with multiple sources +@mobile', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withMultiplePaths),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  const section = page.locator('section', { hasText: 'Contract source code' });

  await expect(section).toHaveScreenshot();
});

test('verified via sourcify', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.verifiedViaSourcify),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 110 } });
});

test('self destructed', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.selfDestructed),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  const section = page.locator('section', { hasText: 'Contract creation code' });
  await expect(section).toHaveScreenshot();
});

test('with twin address alert +@mobile', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withTwinAddress),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.getByRole('alert')).toHaveScreenshot();
});

test('with proxy address alert +@mobile', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withProxyAddress),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.getByRole('alert')).toHaveScreenshot();
});

test('non verified', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.nonVerified),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
