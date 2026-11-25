import { expect, test } from '@playwright/test';

const sectionIds = [
  'start',
  'problem',
  'workflow',
  'evidence',
  'use-cases',
  'security',
  'testimonials',
  'pricing',
  'faq',
];

test('renders the approved marketing sections in order with semantic labels', async ({
  page,
}) => {
  await page.goto('/');

  const ids = await page
    .locator('main > section')
    .evaluateAll((sections) =>
      sections.map((section) => section.id).filter(Boolean),
    );
  expect(ids).toEqual(sectionIds);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Find the companies that matter.',
    }),
  ).toBeVisible();
  await expect(
    page.getByText('OFFER-TO-LEAD INTELLIGENCE', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Understand your offer. Identify the companies that fit. See the evidence behind every opportunity.',
    ),
  ).toBeVisible();
  await expect(
    page.getByText('Illustrative prototype data — not a live customer result'),
  ).toBeVisible();
});

test('routes the hero primary action to the analysis entry point', async ({
  page,
}) => {
  await page.goto('/');

  const hero = page.locator('#start');
  const primary = hero.getByRole('link', { name: 'Get started' });
  await expect(primary).toHaveAttribute('href', '/analyze');
  await expect(
    hero.getByRole('link', { name: 'Explore how it works' }),
  ).toHaveAttribute('href', '#workflow');

  await primary.click();
  await expect(page).toHaveURL(/\/analyze$/);
  await expect(page.getByRole('heading', { name: /Turn Your Offer Into Explainable Opportunities/ })).toBeVisible();
});

test('presents the illustrative qualification preview and six-stage workflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const preview = page.locator('.hero-preview');
  await expect(preview).toBeVisible();
  await expect(preview.locator('.hero-preview__title')).toHaveText(
    'Qualified Opportunities',
  );
  await expect(preview.locator('.hero-preview__company-name')).toHaveText(
    'Northstar Software Group',
  );
  await expect(preview.locator('.hero-preview__industry')).toHaveText(
    'Software & Technology',
  );
  await expect(preview.locator('.hero-preview__match')).toHaveText(
    'Strong Match',
  );
  await expect(preview.locator('.hero-preview__score strong')).toContainText(
    '92',
  );
  await expect(preview.locator('.hero-preview__reason')).toHaveCount(3);
  await expect(preview.locator('.hero-preview__stage-label')).toHaveText([
    'Offer',
    'ICP',
    'Discovery',
    'Qualification',
    'Contacts',
    'Outreach',
  ]);
  await expect(preview.locator('.hero-preview__sample')).toHaveText(
    'Illustrative preview',
  );
  await expect(preview.locator('figcaption')).toContainText(
    'All record data is sample data.',
  );
});

test('presents six sticky workflow stages with real destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#workflow');

  const cards = page.locator('#workflow .workflow-card');
  await expect(cards).toHaveCount(6);
  await expect(page.locator('#workflow-heading')).toHaveText(
    'From offer to reviewed lead.',
  );
  await expect(page.getByText('FROM OFFER TO REVIEWED LEAD', { exact: true })).toBeVisible();

  await expect(page.locator('#workflow h3')).toHaveText([
    'Turn your business offering into a clear qualification foundation.',
    'Decide which companies are worth pursuing before discovery begins.',
    'Build a focused list of candidate accounts that match your target market.',
    'Understand why an account qualifies instead of relying on a score alone.',
    'Turn company intelligence into personalized communication drafts.',
    'Keep every important qualification and outreach decision accountable.',
  ]);

  const ctaLabels = [
    'Open offer preview',
    'Open workspace',
    'Inspect prospects',
    'View sample report',
    'Open campaign preview',
    'View activity preview',
  ];
  const routes = [
    '/analyze',
    '/workspace',
    '/prospects',
    '/analyze/anl_example_01/results',
    '/campaigns',
    '/audit-logs',
  ];
  for (let index = 0; index < 6; index += 1) {
    const link = cards.nth(index).getByRole('link', { name: ctaLabels[index] });
    await expect(link).toHaveAttribute('href', routes[index]);
  }

  await expect(page.locator('#workflow .workflow-preview')).toHaveCount(6);
  await expect(page.locator('#workflow [role="img"]')).toHaveCount(6);
  await expect(cards.first()).toHaveCSS('position', 'sticky');

  const stickyTops = await cards.evaluateAll((elements) =>
    elements.map((element) =>
      Number.parseFloat(getComputedStyle(element).top),
    ),
  );
  expect(stickyTops[1] - stickyTops[0]).toBeGreaterThanOrEqual(16);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(cards.first()).toHaveCSS('position', 'relative');

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test('aligns header and hero to one container and fills the desktop viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const [headerLeft, heroLeft] = await Promise.all([
    page
      .locator('header .marketing-shell')
      .evaluate((element) => element.getBoundingClientRect().left),
    page
      .locator('#start .marketing-shell')
      .evaluate((element) => element.getBoundingClientRect().left),
  ]);
  expect(headerLeft).toBe(heroLeft);

  const heroBox = await page.locator('#start').boundingBox();
  expect(heroBox?.height).toBeGreaterThanOrEqual(900);

  await expect(
    page.locator('header').getByRole('link', { name: 'Explore preview' }),
  ).toHaveAttribute('href', '/dashboard');
});

test('shows three testimonial rows with a working motion control', async ({
  page,
}) => {
  await page.goto('/#testimonials');

  const section = page.locator('#testimonials');
  await expect(
    section.getByRole('heading', {
      name: 'Better conversations start with a clearer signal.',
    }),
  ).toBeVisible();
  await expect(section.getByText(/not verified Vanguard customer endorsements/i))
    .toBeVisible();
  await expect(section.getByTestId('testimonial-row')).toHaveCount(3);
  await expect(section.locator('.testimonial-card')).toHaveCount(22);
  const tracks = section.locator('.testimonial-track');
  await expect(tracks.nth(0)).toHaveCSS('animation-direction', 'normal');
  await expect(tracks.nth(1)).toHaveCSS('animation-direction', 'reverse');
  await expect(tracks.nth(2)).toHaveCSS('animation-direction', 'normal');

  const motionButton = section.getByRole('button', { name: 'Pause motion' });
  await expect(motionButton).toHaveAttribute('aria-pressed', 'false');
  await motionButton.click();
  await expect(section.locator('.testimonial-track').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );
  await expect(
    section.getByRole('button', { name: 'Resume motion' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('presents the redesigned final CTA with its existing preview destination', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const section = page.locator('.final-cta-section');
  await expect(
    section.getByRole('heading', {
      name: 'Your next lead, with evidence.',
    }),
  ).toBeVisible();
  await expect(section).toHaveCSS('background-color', 'rgb(245, 158, 11)');
  await expect(
    section.getByRole('link', { name: 'Open product preview' }),
  ).toHaveAttribute('href', '/dashboard');
  await expect(
    section.getByRole('link', { name: 'Explore how it works' }),
  ).toHaveAttribute('href', '#workflow');
  await expect(
    section.getByRole('link', { name: 'Review the product roadmap' }),
  ).toHaveAttribute('href', '/roadmap');
  const [copyBox, actionsBox] = await Promise.all([
    section.locator('.final-cta-copy').boundingBox(),
    section.locator('.final-cta-actions').boundingBox(),
  ]);
  expect(actionsBox?.x).toBeGreaterThan(
    (copyBox?.x ?? 0) + (copyBox?.width ?? 0),
  );

  await page.setViewportSize({ width: 390, height: 844 });
  const [mobileCopyBox, mobileActionsBox] = await Promise.all([
    section.locator('.final-cta-copy').boundingBox(),
    section.locator('.final-cta-actions').boundingBox(),
  ]);
  expect(mobileActionsBox?.y).toBeGreaterThan(
    (mobileCopyBox?.y ?? 0) + (mobileCopyBox?.height ?? 0),
  );
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test('simplifies the preview at phone widths without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('.hero-preview__sidebar')).toBeHidden();
  await expect(page.locator('.hero-preview__company-name')).toHaveText(
    'Northstar Software Group',
  );
  await expect(page.locator('.hero-preview__stage-label')).toHaveCount(6);

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test('opens, closes, and navigates the mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  const destinations = [
    ['How it works', '#workflow'],
    ['Evidence', '#evidence'],
    ['Use cases', '#use-cases'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ];

  for (const [label, hash] of destinations) {
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  }

  await menuButton.click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Explore preview' })
    .click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto('/');
  await page.setViewportSize({ width: 375, height: 812 });
  await menuButton.click();
  await page.keyboard.press('Escape');
  await expect(menuButton).toBeFocused();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toHaveCount(0);
});

test('supports pointer and keyboard evidence selection', async ({ page }) => {
  await page.goto('/#evidence');

  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(
    page.getByRole('heading', {
      name: '140+ Open Roles in Cloud Platform Experience',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Visit source' }),
  ).toHaveAttribute('href', 'https://careers.microsoft.com');

  await tabs.nth(1).click();
  await page.keyboard.press('End');
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(
    page.getByRole('heading', {
      name: 'Strong Fit for Custom Workflow Integrations',
    }),
  ).toBeVisible();
});

test('keeps FAQ disclosures independent and exposes one answer at a time', async ({
  page,
}) => {
  await page.goto('/#faq');
  const questions = page.locator('details');
  await expect(questions).toHaveCount(7);

  for (let index = 0; index < 7; index += 1) {
    await questions.nth(index).locator('summary').click();
    await expect(questions.nth(index)).toHaveAttribute('open', '');
    await expect(questions.nth(index).locator('p')).toBeVisible();
    if (index > 0) {
      await expect(questions.nth(index - 1)).not.toHaveAttribute('open', '');
    }
  }
});

test('uses only intentional same-origin destinations and safe external links', async ({
  page,
}) => {
  await page.goto('/');
  const links = page.locator('a[href]');
  const hrefs = await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href') ?? ''),
  );
  const allowedPaths = new Set([
    '/',
    '/login',
    '/sign-in',
    '/sign-up',
    '/analyze',
    '/dashboard',
    '/workspace',
    '/prospects',
    '/campaigns',
    '/reports',
    '/audit-logs',
    '/analyze/anl_example_01/results',
    '/roadmap',
    '/privacy',
    '/terms',
    '/cookies',
    '/acceptable-use',
    '/security',
    '/dpa',
  ]);
  const allowedHashes = new Set([
    '#main-content',
    '#start',
    '#workflow',
    '#evidence',
    '#use-cases',
    '#security',
    '#pricing',
    '#faq',
  ]);

  expect(hrefs).not.toContain('#');
  expect(hrefs).not.toContain('#final');
  for (const href of hrefs) {
    if (href.startsWith('#')) {
      expect(allowedHashes.has(href), `unexpected fragment ${href}`).toBe(true);
    } else if (href.startsWith('/')) {
      expect(allowedPaths.has(href), `unexpected local route ${href}`).toBe(
        true,
      );
    } else {
      expect(href).toMatch(/^https:\/\//);
    }
  }

  const externalLinks = page.locator('a[target="_blank"]');
  for (let index = 0; index < (await externalLinks.count()); index += 1) {
    await expect(externalLinks.nth(index)).toHaveAttribute('rel', 'noreferrer');
  }
});

test('retires the simulated standalone landing document', async ({ page }) => {
  const response = await page.goto('/landing/index.html');
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/DRAFT VALUES/i)).toHaveCount(0);
});

test('moves keyboard focus from the skip link to the main content', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.getByRole('main')).toBeFocused();
});

test('keeps the hero readable without WebGL when reduced motion is requested', async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.shader-hero__layer')).toHaveCount(0);
  await expect(page.locator('.shader-hero__fallback')).toBeVisible();
  await expect(
    page.locator('#start').getByRole('link', { name: 'Get started' }),
  ).toHaveAttribute('href', '/analyze');
  await expect(page.locator('.split-reveal__char').first()).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page.locator('.hero-preview')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page.locator('#workflow .workflow-card').first()).toHaveCSS(
    'position',
    'relative',
  );
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Find the companies that matter.',
    }),
  ).toBeVisible();
});
