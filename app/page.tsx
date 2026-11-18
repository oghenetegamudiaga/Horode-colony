'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [greeting, setGreeting] = useState('Good morning, Tega');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning, Tega');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon, Tega');
    } else {
      setGreeting('Good evening, Tega');
    }
  }, []);

  return (
    <div className="space-y-12 py-4">
      {/* Centered Large Greeting */}
      <div className="text-center pt-8 pb-4">
        <h1 className="type-greeting text-text font-bold">
          {greeting}
        </h1>
      </div>

      {/* Section: Recently checked */}
      <section className="space-y-3">
        <div className="type-section-label">
          Recently checked
        </div>

        {/* Empty state card */}
        <div className="rounded-md bg-surface p-6 text-center">
          <p className="text-[14px] text-text-muted">
            No recently checked carousels.
          </p>
        </div>
      </section>

      {/* Section: Needs attention */}
      <section className="space-y-3">
        <div className="type-section-label">
          Needs attention
        </div>

        {/* Empty state card */}
        <div className="rounded-md bg-surface p-6 text-center">
          <p className="text-[14px] text-text-muted">
            No issues requiring attention.
          </p>
        </div>
      </section>

      {/* First-time onboarding callout */}
      <section className="pt-4">
        <div className="rounded-md bg-surface p-8 text-center space-y-4">
          <p className="text-[15px] text-text">
            Nothing here yet. Start with a new check.
          </p>
          <div>
            <Link
              href="/checks/new"
              className="inline-flex items-center justify-center h-9 px-4 text-[14px] font-medium text-white bg-accent hover:opacity-90 rounded-sm focus-ring transition-opacity"
            >
              New check
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
