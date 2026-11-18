'use client';

import React from 'react';
import { SidebarToggleGlyph, EllipsisGlyph } from '@/components/ui/glyphs';

interface AppHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export function AppHeader({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileMenu,
}: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between h-12 px-4 select-none shrink-0">
      <div className="flex items-center gap-2">
        {/* Mobile menu trigger (< 768px) */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden px-2 py-1 text-[13px] font-medium text-text rounded-sm hover:bg-surface-hover focus-ring transition-colors"
          aria-label="Open navigation menu"
        >
          Menu
        </button>

        {/* Desktop re-open toggle (when collapsed) */}
        {sidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex items-center justify-center p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-sm focus-ring transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <SidebarToggleGlyph className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Top-right ellipsis menu button (page options, empty for now) */}
        <button
          className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-sm focus-ring transition-colors"
          title="Page options"
          aria-label="Page options"
        >
          <EllipsisGlyph className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
