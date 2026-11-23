import { expect, test } from '@playwright/test';

test('registers a root-scoped service worker and keeps page data out of caches', async ({
  page,
}) => {
  await page.goto('/');

  const worker = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return {
      scope: registration.scope,
      script: registration.active?.scriptURL,
    };
  });

  expect(worker.scope).toBe('http://127.0.0.1:3101/');
  expect(worker.script).toContain('/sw.js');

  const cachedPaths = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    return Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        return (await cache.keys()).map(
          (request) => new URL(request.url).pathname,
        );
      }),
    ).then((groups) => groups.flat());
  });

  expect(cachedPaths).toContain('/offline.html');
  expect(cachedPaths).not.toContain('/');
  expect(cachedPaths).not.toContain('/roadmap');
  expect(cachedPaths.some((path) => path.startsWith('/api/'))).toBe(false);
});

test('shows a static offline fallback for a navigation when disconnected', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (navigator.serviceWorker.controller) return;
    await new Promise<void>((resolve) => {
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => resolve(),
        {
          once: true,
        },
      );
    });
  });

  await context.setOffline(true);
  await page.goto('/roadmap?offline-check=1');
  await expect(
    page.getByRole('heading', { name: 'You’re offline' }),
  ).toBeVisible();
  await expect(
    page.getByText('Your account data is never stored for offline use.'),
  ).toBeVisible();
});
