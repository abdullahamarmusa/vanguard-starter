import { expect, test } from '@playwright/test';

test('serves the integrated VANGUARD landing design at the public home route', async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Find the companies that matter/ }),
  ).toBeVisible();
  await expect(
    page.locator('#start').getByRole('link', { name: 'Get started' }),
  ).toHaveAttribute('href', '/analyze');

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.content,
      `landing should fit at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.viewport);
  }
  expect(browserErrors).toEqual([]);
});

test('landing preview action opens the public prototype', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore preview' }).first().click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Welcome back, Alex!/ })).toBeVisible();
  await expect(page.getByRole('note', { name: 'VANGUARD prototype status' })).toBeVisible();
});

test('unknown routes return the proper 404 page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
});

test('the dashboard is public and identifies its illustrative data', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('note', { name: 'VANGUARD prototype status' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Illustrative Preview' })).toBeVisible();
});

test('Quick Analyze is available without an account', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Analyze' }).click();
  await expect(page).toHaveURL(/\/analyze$/);
  await expect(page.getByRole('note', { name: 'VANGUARD prototype status' })).toBeVisible();
});

test('renders every integrated dashboard destination', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  const destinations = ['/dashboard','/analyze','/analyze/anl_example_01','/analyze/anl_example_01/results','/prospects','/campaigns','/workspace','/reports','/agents','/settings','/members','/billing','/audit-logs','/roadmap'] as const;

  for (const route of destinations) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should load successfully`).toBeTruthy();
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await expect(page.getByRole('note', { name: 'VANGUARD prototype status' })).toBeVisible();
  }

  expect(browserErrors).toEqual([]);
});
