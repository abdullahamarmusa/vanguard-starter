'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isIosDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  );
}

function subscribeToAppInstalled(onChange: () => void) {
  window.addEventListener('appinstalled', onChange);
  return () => window.removeEventListener('appinstalled', onChange);
}

function getIosInstallHelpVisibility() {
  return isIosDevice() && !isStandalone();
}

export function PwaControls() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const showIosInstructions = useSyncExternalStore(
    subscribeToAppInstalled,
    getIosInstallHelpVisibility,
    () => false,
  );
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const registration = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    if (
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return () => {
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      };
    }

    let active = true;
    const hadController = Boolean(navigator.serviceWorker.controller);
    const handleControllerChange = () => {
      if (hadController) window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange,
    );

    void navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((workerRegistration) => {
        if (!active) return;
        registration.current = workerRegistration;
        setUpdateAvailable(Boolean(workerRegistration.waiting));

        workerRegistration.addEventListener('updatefound', () => {
          const installingWorker = workerRegistration.installing;
          installingWorker?.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true);
            }
          });
        });

        void workerRegistration.update().catch(() => undefined);
      })
      .catch(() => undefined);

    return () => {
      active = false;
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange,
      );
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const applyUpdate = () => {
    registration.current?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    setUpdateAvailable(false);
  };

  if (!installPrompt && !showIosInstructions && !updateAvailable) return null;

  return (
    <div className="pwa-controls" aria-label="App options">
      {installPrompt && (
        <button className="pwa-action" onClick={install} type="button">
          Install app
        </button>
      )}
      {showIosInstructions && (
        <details className="pwa-install-help">
          <summary className="pwa-action">Install</summary>
          <p>In Safari, tap Share, then choose Add to Home Screen.</p>
        </details>
      )}
      {updateAvailable && (
        <button
          className="pwa-action pwa-update"
          onClick={applyUpdate}
          type="button"
        >
          Update ready
        </button>
      )}
    </div>
  );
}
