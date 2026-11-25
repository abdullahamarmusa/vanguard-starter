import type { CSSProperties } from 'react';

interface SplitTextRevealProps {
  lines: string[];
  className?: string;
  initialDelayMs?: number;
  staggerMs?: number;
}

/**
 * Character-mask reveal adapted from the text-reveal reference.
 *
 * The reference animates each character with a 120% vertical offset and a
 * 0.6s cubic-bezier(0.16, 1, 0.3, 1) transition. This version keeps the same
 * mask, travel, easing, and stagger, but drives it with a CSS animation so the
 * server-rendered headline is visible without JavaScript and can be disabled
 * completely by `prefers-reduced-motion`.
 *
 * The visible characters are hidden from assistive technology; the heading
 * owns the accessible name.
 */
export function SplitTextReveal({
  lines,
  className,
  initialDelayMs = 140,
  staggerMs = 15,
}: SplitTextRevealProps) {
  let characterIndex = 0;

  return (
    <span className={className} aria-hidden="true">
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');

        return (
          <span className="split-reveal__line" key={`${lineIndex}-${line}`}>
            {words.map((word, wordIndex) => {
              const characters = Array.from(word);

              return (
                <span className="split-reveal__fragment" key={wordIndex}>
                  <span className="split-reveal__word">
                    {characters.map((character, index) => {
                      const delay = initialDelayMs + characterIndex * staggerMs;
                      characterIndex += 1;

                      return (
                        <span
                          className="split-reveal__char-mask"
                          key={`${wordIndex}-${index}`}
                        >
                          <span
                            className="split-reveal__char"
                            style={
                              {
                                '--split-char-delay': `${delay}ms`,
                              } as CSSProperties
                            }
                          >
                            {character}
                          </span>
                        </span>
                      );
                    })}
                  </span>
                  {wordIndex < words.length - 1 ? (
                    <span className="split-reveal__space"> </span>
                  ) : null}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
