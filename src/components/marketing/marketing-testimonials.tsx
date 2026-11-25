'use client';

import { Pause, Play } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Stuart Armley-Jones',
    company: 'Student Radar',
    quote:
      "Multi-academy trusts have been the hardest to get a foot in the door with. With Explee they're the ones I hear back from most, and a few trusts are now coming on board.",
  },
  {
    name: 'Adejuwon Oyebanjo',
    company: 'Passpoint',
    quote:
      "We've closed 6 leads who are at advanced stages of conversion.",
  },
  {
    name: 'Jack Deakin',
    company: 'Revest',
    quote:
      "I've run business development teams for five or six years, and I'm very impressed. It's like having a team, by yourself.",
  },
  {
    name: 'Joe Purcell',
    company: 'LogSure',
    quote:
      'I tried Instantly, I tried Apollo — you have to register a domain, set up DNS, warm it up. With yours you type your web address and it does all the domain warming for you... and every lead is the business owner, so the pilots convert extremely well.',
  },
  {
    name: 'Yassine Rajallah',
    company: 'BlazeHive',
    quote:
      'I got replies from just the $30 plan, which felt crazy. Two of them already turned into booked meetings.',
  },
  {
    name: 'Farhat Asif',
    company: 'The Diplomatic Insight',
    quote:
      'Explee has opened doors we would have spent months trying to knock on manually.',
  },
  {
    name: 'Wole Fagbohun',
    company: 'PlotWeaver',
    quote:
      "I'm literally obsessed with this platform. It's the best, simplest, clearest platform I've seen. A dream come true for me.",
  },
  {
    name: 'Wil Geller',
    company: 'Foodfluence',
    quote:
      "It's capable of booking five to ten demos a week on its own — I'd put more than $500 in if that keeps up... and with barely any instructions the leads are accurate. Other platforms scrape the worst fits ever.",
  },
  {
    name: 'Gary Le Sueur',
    company: 'CalmCompliance',
    quote:
      "It's been fully automated so far: we sent the emails out, they said yes please, the bot replied with the booking link and they booked it in.",
  },
  {
    name: 'Camille Rose',
    company: 'CamTalk Solutions',
    quote:
      'We tried cold outreach with an agency and got zero responses. With Explee people actually reply, and what used to take hours takes me 15 minutes a day.',
  },
  {
    name: 'Raju Bhupatiraju',
    company: 'PODS Asia',
    quote:
      "A CEO told me: I'm glad you researched my company. The first paragraph Explee wrote was a hit.",
  },
];

const rows = [
  testimonials.slice(0, 4),
  testimonials.slice(4, 8),
  testimonials.slice(8),
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

export function MarketingTestimonials() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      id="testimonials"
      className="testimonial-section marketing-section"
      data-paused={isPaused}
    >
      <div className="marketing-container testimonial-heading">
        <div>
          <h2 className="font-display text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Better conversations start with a clearer signal.
          </h2>
          <p className="testimonial-demo-note">
            Demo testimonials from the design reference. These are not verified
            Vanguard customer endorsements.
          </p>
        </div>
        <button
          type="button"
          className="testimonial-motion-button"
          aria-pressed={isPaused}
          onClick={() => setIsPaused((paused) => !paused)}
        >
          {isPaused ? (
            <Play className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Pause className="h-4 w-4" aria-hidden="true" />
          )}
          {isPaused ? 'Resume motion' : 'Pause motion'}
        </button>
      </div>

      <div className="testimonial-rows" aria-label="Demo testimonials">
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="testimonial-rail"
            data-testid="testimonial-row"
          >
            <div
              className={`testimonial-track testimonial-track--${rowIndex + 1}`}
            >
              {[false, true].map((isDuplicate) => (
                <div
                  key={String(isDuplicate)}
                  className="testimonial-track__group"
                  aria-hidden={isDuplicate}
                >
                  {row.map((testimonial) => (
                    <article
                      key={testimonial.name}
                      className="testimonial-card"
                    >
                      <blockquote className="testimonial-quote">
                        “{testimonial.quote}”
                      </blockquote>
                      <footer className="testimonial-author">
                        <span className="testimonial-avatar" aria-hidden="true">
                          {getInitials(testimonial.name)}
                        </span>
                        <span className="testimonial-author__details">
                          <cite>{testimonial.name}</cite>
                          <span>{testimonial.company}</span>
                        </span>
                      </footer>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
