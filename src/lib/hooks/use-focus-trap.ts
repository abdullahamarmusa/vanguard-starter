'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  "input:not([disabled]):not([type='hidden'])",
  'select:not([disabled])',
  'textarea:not([disabled])',
  "[tabindex]:not([tabindex='-1'])",
].join(', ');

/**
 * WCAG 2.1 AA Focus Trap Hook for Modals & Drawers.
 * - Moves focus into the dialog container on open.
 * - Traps Tab / Shift+Tab cycling within the container.
 * - Handles Escape dismissal.
 * - Restores focus back to the triggering element on close.
 */
export function useFocusTrap<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
) {
  const containerRef = useRef<T | null>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousActiveRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    // Move focus into dialog container on next frame
    const raf = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const focusables =
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!active || active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      if (
        previousActiveRef.current &&
        typeof previousActiveRef.current.focus === 'function'
      ) {
        previousActiveRef.current.focus();
      }
    };
  }, [open]);

  return containerRef;
}
