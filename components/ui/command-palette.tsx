'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useTheme } from './theme-provider';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [search, setSearch] = useState('');

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-[2px] transition-opacity"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-[560px] mx-4 rounded-md bg-surface text-text shadow-soft overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <Command
          className="w-full flex flex-col focus-ring"
          shouldFilter={true}
        >
          <div className="flex items-center px-4 py-3 border-b border-border/50">
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search or type a command..."
              className="w-full bg-transparent text-[14px] text-text placeholder:text-text-faint outline-none"
              autoFocus
            />
            <kbd className="text-[11px] font-mono text-text-faint bg-surface-hover px-1.5 py-0.5 rounded-sm">
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-[320px] overflow-y-auto p-2 scrollbar-none">
            <Command.Empty className="py-6 text-center text-[13px] text-text-muted">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted"
            >
              <Command.Item
                onSelect={() => handleSelect(() => router.push('/checks/new'))}
                className="flex items-center justify-between px-2.5 py-2 text-[14px] rounded-sm cursor-pointer select-none text-text aria-selected:bg-surface-hover hover:bg-surface-hover transition-colors"
              >
                <span>New check</span>
                <span className="text-[12px] text-text-faint">Action</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => router.push('/clients/new'))}
                className="flex items-center justify-between px-2.5 py-2 text-[14px] rounded-sm cursor-pointer select-none text-text aria-selected:bg-surface-hover hover:bg-surface-hover transition-colors"
              >
                <span>Add client</span>
                <span className="text-[12px] text-text-faint">Action</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => setTheme('dark'))}
                className="flex items-center justify-between px-2.5 py-2 text-[14px] rounded-sm cursor-pointer select-none text-text aria-selected:bg-surface-hover hover:bg-surface-hover transition-colors"
              >
                <span>Switch theme: Dark</span>
                <span className="text-[12px] text-text-faint">Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => setTheme('light'))}
                className="flex items-center justify-between px-2.5 py-2 text-[14px] rounded-sm cursor-pointer select-none text-text aria-selected:bg-surface-hover hover:bg-surface-hover transition-colors"
              >
                <span>Switch theme: Light</span>
                <span className="text-[12px] text-text-faint">Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => setTheme('system'))}
                className="flex items-center justify-between px-2.5 py-2 text-[14px] rounded-sm cursor-pointer select-none text-text aria-selected:bg-surface-hover hover:bg-surface-hover transition-colors"
              >
                <span>Switch theme: System</span>
                <span className="text-[12px] text-text-faint">Theme</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Checks"
              className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted"
            >
              <div className="px-2.5 py-2 text-[13px] text-text-muted">
                No recent checks
              </div>
            </Command.Group>

            <Command.Group
              heading="Clients"
              className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted"
            >
              <div className="px-2.5 py-2 text-[13px] text-text-muted">
                No clients yet
              </div>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
