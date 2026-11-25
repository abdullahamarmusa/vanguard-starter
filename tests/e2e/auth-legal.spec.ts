import { expect, test } from '@playwright/test';

test('routes account URLs back to the public V1 prototype', async ({
  page,
}) => {
  for (const route of [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/onboarding',
  ]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole('note', { name: 'VANGUARD prototype status' }),
    ).toBeVisible();
  }
});

test('publishes each legal page with review status and cross-links', async ({
  page,
}) => {
  const routes = [
    '/privacy',
    '/terms',
    '/cookies',
    '/acceptable-use',
    '/security',
    '/dpa',
  ];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(
      page.getByText(/Draft|review|placeholder/i).first(),
    ).toBeVisible();
    await expect(
      page
        .getByRole('navigation', { name: 'Legal documents' })
        .getByRole('link'),
    ).toHaveCount(6);
  }
});

test('keeps the public prototype usable on a narrow phone viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/dashboard');
  await expect(
    page.getByRole('note', { name: 'VANGUARD prototype status' }),
  ).toBeVisible();
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .map((element) => ({
        tag: element.tagName,
        className:
          typeof element.className === 'string' ? element.className : '',
        right: Math.round(element.getBoundingClientRect().right),
      }))
      .filter(
        (element) => element.right > document.documentElement.clientWidth + 1,
      )
      .slice(0, 8),
  );
  expect(
    sizes.content,
    `overflowing elements: ${JSON.stringify(overflow)}`,
  ).toBeLessThanOrEqual(sizes.viewport);
});
