import { expect, test } from '@playwright/test';

test('the overview makes the unconfigured foundation explicit', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Overview', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText('No customer data or external providers are connected.'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'View roadmap' }),
  ).toHaveAttribute('href', '/roadmap');
});
