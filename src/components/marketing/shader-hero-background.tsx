'use client';

import { useSyncExternalStore } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks/use-media-query';

/**
 * VANGUARD's atmospheric hero layer.
 *
 * The reference hero renders two Paper Shaders mesh gradients: a full-colour
 * field and a lower-opacity second pass. We keep that two-layer character but
 * replace the purple palette with charcoal, amber, teal, and a restrained
 * white highlight.
 *
 * Paper Shaders owns the WebGL lifecycle: resize observation, device-pixel
 * ratio handling, viewport/visibility pausing, and disposal on unmount. The
 * wrapper is decorative and never receives pointer events.
 */

const PRIMARY_COLORS = [
  '#08090C',
  '#F59E0B',
  '#0F172A',
  '#F8FAFC',
  '#F59E0B',
  '#0B3B3B',
];

const SECONDARY_COLORS = ['#08090C', '#00B6B6', '#F8FAFC', '#08090C'];

const subscribeToHydration = () => () => {};

export function ShaderHeroBackground() {
  // false during server rendering and hydration, true once the client store is
  // available. This avoids mounting a canvas into markup that cannot hydrate.
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const reducedMotion = useReducedMotion();
  const compact = useMediaQuery('(max-width: 767px)');

  const showShader = mounted && !reducedMotion;

  return (
    <div className="shader-hero__atmosphere" aria-hidden="true">
      {/* Static fallback is painted first so there is never a blank canvas. */}
      <div className="shader-hero__fallback" />

      {showShader && (
        <>
          <div className="shader-hero__layer">
            <MeshGradient
              className="shader-hero__canvas"
              colors={PRIMARY_COLORS}
              speed={0.22}
              distortion={0.88}
              swirl={0.16}
              grainMixer={0.12}
              grainOverlay={0.018}
              fit="cover"
              minPixelRatio={1.5}
              maxPixelCount={compact ? 1_350_000 : 3_200_000}
            />
          </div>

          {!compact && (
            <div className="shader-hero__layer shader-hero__layer--soft">
              <MeshGradient
                className="shader-hero__canvas"
                colors={SECONDARY_COLORS}
                speed={0.14}
                distortion={0.98}
                swirl={0.3}
                grainMixer={0.12}
                grainOverlay={0}
                fit="cover"
                minPixelRatio={1.25}
                maxPixelCount={1_600_000}
              />
            </div>
          )}
        </>
      )}

      <div className="shader-hero__teal" />
      <div className="shader-hero__warm" />
      <div className="shader-hero__scrim" />
      <div className="shader-hero__grain" />
    </div>
  );
}
