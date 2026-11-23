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
  const landing = page.frameLocator(
    'iframe[title="VANGUARD marketing landing page"]',
  );
  await expect(
    landing.getByRole('heading', { name: /Find the companies that matter/ }),
  ).toBeVisible();
  await expect(
    landing.getByRole('link', { name: /Start Analyzing/ }).first(),
  ).toBeVisible();

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await landing.locator('html').evaluate((element) => ({
      viewport: element.clientWidth,
      content: element.scrollWidth,
    }));
    expect(
      dimensions.content,
      `landing should fit at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.viewport);
  }
  expect(browserErrors).toEqual([]);
});

test('landing sign-in link reaches the explicit authentication placeholder', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .frameLocator('iframe[title="VANGUARD marketing landing page"]')
    .getByRole('link', { name: 'Sign in', exact: true })
    .click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole('heading', { name: 'Sign-in is not set up yet' }),
  ).toBeVisible();
  await expect(page.getByText(/no account session was created/i)).toBeVisible();
});

test('unknown routes return the proper 404 page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
});

test('the dashboard presents the main VANGUARD workspace', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(
    page.getByRole('heading', { name: /Welcome back/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Illustrative Preview' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Start Analysis/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Performance Overview/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Top Industries' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Recent Activity' }),
  ).toBeVisible();
});

test('Quick Analyze validates input and routes without claiming an analysis started', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Start Analysis/ }).click();
  await expect(page.locator('[role="alert"]').first()).toContainText(
    /at least 3 characters/i,
  );

  await page
    .getByLabel('Website URL, offer description, or business idea')
    .fill('SaaS for remote teams');
  await page.getByRole('button', { name: /Start Analysis/ }).click();
  await expect(page).toHaveURL(/\/analyze\?input=/);
  await expect(
    page.getByRole('heading', { name: /Turn Your Offer Into/ }),
  ).toBeVisible();
  await expect(
    page.getByLabel('Website URL, Offer Headline, or Business Idea'),
  ).toHaveValue('SaaS for remote teams');
  await page.getByRole('button', { name: /Start Analysis/ }).click();
  await expect(page.locator('p[role="alert"]')).toContainText(
    /no analysis job was started/i,
  );
});

test('renders every integrated dashboard destination', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  const destinations = [
    ['/dashboard', /Welcome back/],
    ['/analyze', /Turn Your Offer Into/],
    ['/analyze/anl_example_01', /Website Analysis/],
    ['/analyze/anl_example_01/results', /Website Analysis Results/],
    ['/prospects', /Discover & Manage Your Prospects/],
    ['/campaigns', /Campaigns/],
    ['/workspace', /Your Workspace/],
    ['/reports', /Reports/],
    ['/agents', /AI Agents for Smarter Growth/],
    ['/settings', /Workspace Settings/],
    ['/members', /Members & Roles/],
    ['/billing', /Billing & Usage/],
    ['/audit-logs', /Audit Logs/],
    ['/roadmap', /Roadmap/],
  ] as const;

  for (const [route, heading] of destinations) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should load successfully`).toBeTruthy();
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
  }

  expect(browserErrors).toEqual([]);
});
