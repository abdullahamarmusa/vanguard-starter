'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  useHydrated,
  useReducedMotion,
} from '@/lib/hooks/use-media-query';

interface ShaderCtaButtonProps {
  href: string;
  label: string;
}

interface ShaderMountHandle {
  setSpeed: (speed?: number) => void;
  dispose: () => void;
}

/**
 * Primary CTA using the liquid-metal shader from the shader-button reference.
 *
 * The reference mounts Paper Shaders' core `ShaderMount` against a pill-shaped
 * clipping container and changes speed on hover. We keep that material and
 * interaction model, tint it with VANGUARD amber, and wrap it in a real link so
 * the action is available immediately and works without WebGL.
 */
export function ShaderCtaButton({ href, label }: ShaderCtaButtonProps) {
  const shaderHostRef = useRef<HTMLSpanElement>(null);
  const mountRef = useRef<ShaderMountHandle | null>(null);
  const reducedMotion = useReducedMotion();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated || reducedMotion || !shaderHostRef.current) return;

    let cancelled = false;

    import('@paper-design/shaders')
      .then(({ ShaderMount, getShaderColorFromString, liquidMetalFragmentShader }) => {
        if (cancelled || !shaderHostRef.current) return;

        mountRef.current = new ShaderMount(
          shaderHostRef.current,
          liquidMetalFragmentShader,
          {
            u_repetition: 4,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 0,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
            u_colorBack: getShaderColorFromString('#F59E0B'),
            u_colorTint: getShaderColorFromString('#FFF3C4'),
          },
          undefined,
          0.6,
        );
      })
      .catch(() => {
        // The amber fallback remains fully usable when WebGL is unavailable.
      });

    return () => {
      cancelled = true;
      mountRef.current?.dispose();
      mountRef.current = null;
    };
  }, [hydrated, reducedMotion]);

  const setSpeed = (speed: number) => {
    mountRef.current?.setSpeed(speed);
  };

  return (
    <Link
      href={href}
      className="shader-cta"
      onMouseEnter={() => setSpeed(1.1)}
      onMouseLeave={() => setSpeed(0.6)}
      onFocus={() => setSpeed(1.1)}
      onBlur={() => setSpeed(0.6)}
    >
      <span className="shader-cta__shader" ref={shaderHostRef} aria-hidden="true" />
      <span className="shader-cta__tint" aria-hidden="true" />
      <span className="shader-cta__label">
        {label}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
