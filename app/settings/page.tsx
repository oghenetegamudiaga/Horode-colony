'use client';

import React from 'react';
import { useTheme } from '@/components/ui/theme-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const shortcuts = [
    { key: 'Ctrl+K', action: 'Open search and command palette' },
    { key: 'J / ↓', action: 'Next issue' },
    { key: 'K / ↑', action: 'Previous issue' },
    { key: 'A', action: 'Accept fix' },
    { key: 'I', action: 'Ignore issue' },
    { key: 'N', action: 'Never flag this for client' },
    { key: '← / →', action: 'Previous / next slide' },
    { key: 'C', action: 'Copy corrections checklist' },
    { key: '?', action: 'Show shortcuts reference' },
  ];

  return (
    <div className="space-y-8 py-4 max-w-[680px]">
      <div className="space-y-2">
        <h1 className="type-page-title text-text">Settings</h1>
        <p className="text-[14px] text-text-muted">
          Workspace preferences and configuration.
        </p>
      </div>

      {/* Appearance Control */}
      <section className="space-y-3">
        <div className="type-section-label">Appearance</div>
        <div className="p-4 bg-surface rounded-md space-y-3">
          <p className="text-[14px] text-text">
            Choose interface theme. Dark mode is the default.
          </p>
          <div className="inline-flex p-1 bg-surface-hover rounded-sm gap-1">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 text-[13px] rounded-sm transition-colors focus-ring ${
                theme === 'light'
                  ? 'bg-accent text-white font-medium'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 text-[13px] rounded-sm transition-colors focus-ring ${
                theme === 'dark'
                  ? 'bg-accent text-white font-medium'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-3 py-1.5 text-[13px] rounded-sm transition-colors focus-ring ${
                theme === 'system'
                  ? 'bg-accent text-white font-medium'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              System
            </button>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts Reference */}
      <section id="shortcuts" className="space-y-3">
        <div className="type-section-label">Keyboard shortcuts</div>
        <div className="bg-surface rounded-md divide-y divide-border/30 overflow-hidden">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between px-4 py-2.5 text-[14px]"
            >
              <span className="text-text">{s.action}</span>
              <kbd className="font-mono text-[12px] bg-surface-hover text-text-muted px-2 py-0.5 rounded-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
