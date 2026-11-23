import { expect, test } from '@playwright/test';

test('keeps the shared workspace usable at phone, tablet, and desktop widths', async ({
  page,
}) => {
  await page.goto('/dashboard');

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(
      page.getByRole('heading', { name: /Welcome back/ }),
    ).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

    if (width <= 820) {
      await expect(
        page.getByRole('button', { name: 'Open navigation menu' }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole('navigation', { name: 'Primary navigation' }),
      ).toBeVisible();
    }
  }
});

test('opens mobile navigation and follows a route', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page
    .getByRole('dialog', { name: 'Navigation menu' })
    .getByRole('link', { name: /Analyze/ })
    .click();

  await expect(page).toHaveURL(/\/analyze/);
  await expect(
    page.getByRole('heading', { name: /Turn Your Offer Into/ }),
  ).toBeVisible();
});

test('keeps integrated section layouts within phone, tablet, and desktop widths', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const routes = [
    '/analyze',
    '/prospects',
    '/campaigns',
    '/workspace',
    '/reports',
    '/agents',
    '/settings',
    '/members',
    '/billing',
    '/audit-logs',
  ];

  for (const route of routes) {
    await page.goto(route);
    for (const width of [375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.content,
        `${route} should not overflow at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport);
    }
  }
});

test('serves a complete VANGUARD web manifest and icon set', async ({
  page,
}) => {
  const response = await page.request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();

  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: 'VANGUARD',
    short_name: 'VANGUARD',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0D0E11',
    background_color: '#0D0E11',
  });

  for (const icon of [
    { url: '/icons/icon-192.png', size: 192 },
    { url: '/icons/icon-512.png', size: 512 },
    { url: '/icons/apple-touch-icon.png', size: 180 },
  ]) {
    const iconResponse = await page.request.get(icon.url);
    expect(iconResponse.ok()).toBeTruthy();
    expect(iconResponse.headers()['content-type']).toContain('image/png');
    const image = await iconResponse.body();
    expect(image.readUInt32BE(16)).toBe(icon.size);
    expect(image.readUInt32BE(20)).toBe(icon.size);
  }
});
