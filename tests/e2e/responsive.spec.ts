import { expect, test } from '@playwright/test';

test('keeps the shared workspace usable at phone, tablet, and desktop widths', async ({
  page,
}) => {
  await page.goto('/');

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

    if (width <= 820) {
      await expect(page.getByRole('button', { name: 'Menu' })).toHaveCount(0);
      await expect(page.locator('.mobile-menu summary')).toBeVisible();
    } else {
      await expect(page.locator('.sidebar')).toBeVisible();
    }
  }
});

test('opens mobile navigation and follows a route', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('.mobile-menu summary').click();
  await page.getByRole('link', { name: 'Roadmap', exact: true }).click();

  await expect(page).toHaveURL(/\/roadmap$/);
  await expect(page.getByRole('heading', { name: 'Roadmap' })).toBeVisible();
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
    theme_color: '#1b6c80',
    background_color: '#f9fbfc',
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
