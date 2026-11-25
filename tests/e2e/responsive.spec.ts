import { expect, test } from '@playwright/test';

test('uses the dark application theme and removes theme controls', async ({
  page,
}) => {
  await page.goto('/dashboard');

  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(
    page.getByRole('button', { name: /switch to .* theme/i }),
  ).toHaveCount(0);

  await page.goto('/settings');
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole('note', { name: 'VANGUARD prototype status' })).toBeVisible();
});

test('passes the complete responsive landing viewport matrix', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto('/');

  const sizes = [
    [360, 800],
    [390, 844],
    [414, 896],
    [768, 1024],
    [800, 1280],
    [820, 1180],
    [1024, 768],
    [1280, 800],
    [1366, 768],
    [1440, 900],
    [1536, 864],
    [1920, 1080],
    [2560, 1440],
  ];

  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.content,
      `landing should not overflow at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.viewport);
  }

  await expect(page.locator('.marketing-page')).toHaveCSS(
    'background-color',
    'rgb(247, 248, 250)',
  );
  await expect(page.locator('h1').first()).toHaveCSS(
    'font-family',
    /Inter Tight/,
  );
});

test('keeps the shared workspace usable at phone, tablet, and desktop widths', async ({
  page,
}) => {
  await page.goto('/dashboard');

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('heading', { name: /Welcome back, Alex!/ })).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

  }
});

test('opens the app navigation without an account', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Welcome back, Alex!/ })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
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
    await expect(page).toHaveURL(new RegExp(`${route}$`));
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
