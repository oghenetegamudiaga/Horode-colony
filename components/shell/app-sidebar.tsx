'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarToggleGlyph, ChevronGlyph, CloseGlyph } from '@/components/ui/glyphs';
import { useTheme } from '@/components/ui/theme-provider';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenCommandPalette: () => void;
}

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenCommandPalette,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [clientsExpanded, setClientsExpanded] = useState(true);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center w-full px-2.5 py-1.5 text-[14px] rounded-sm transition-colors text-left truncate ${
      active
        ? 'bg-accent-soft text-text font-medium'
        : 'text-text/90 hover:bg-surface-hover hover:text-text'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-text select-none">
      {/* 1. Header: Toggle and Workspace Mark */}
      <div className="flex items-center justify-between px-3 py-3 h-12">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-sm text-text-muted hover:text-text hover:bg-surface-hover transition-colors focus-ring"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <SidebarToggleGlyph className="w-4 h-4" />
          </button>
          <span className="font-semibold text-[15px] tracking-tight text-text">
            Horode
          </span>
        </div>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-sm text-text-muted hover:text-text hover:bg-surface-hover focus-ring"
            aria-label="Close menu"
          >
            <CloseGlyph className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Search Field */}
      <div className="px-3 py-1">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-full px-2.5 py-1.5 text-[13px] text-text-faint bg-surface/60 hover:bg-surface rounded-sm transition-colors focus-ring text-left"
          title="Open search (Ctrl+K)"
        >
          <span>Search</span>
          <kbd className="text-[11px] font-mono bg-surface-hover px-1.5 py-0.2 rounded-sm text-text-faint">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* 3. Primary Nav Rows */}
      <div className="px-2 pt-3 space-y-0.5">
        <Link
          href="/"
          onClick={onCloseMobile}
          className={navItemClass(isActive('/'))}
        >
          Home
        </Link>
        <Link
          href="/checks/new"
          onClick={onCloseMobile}
          className={navItemClass(isActive('/checks/new'))}
        >
          New check
        </Link>
      </div>

      {/* 4. Clients Section */}
      <div className="px-2 pt-5">
        <div className="flex items-center justify-between px-2.5 py-1">
          <button
            onClick={() => setClientsExpanded(!clientsExpanded)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-text focus-ring rounded-sm"
          >
            <ChevronGlyph
              direction={clientsExpanded ? 'down' : 'right'}
              className="w-2.5 h-2.5 text-text-muted"
            />
            <span>Clients</span>
          </button>
        </div>

        {clientsExpanded && (
          <div className="pl-3 pt-1 space-y-1">
            <div className="px-2.5 py-1 text-[13px] text-text-muted">
              No clients yet
            </div>
            <Link
              href="/clients/new"
              onClick={onCloseMobile}
              className="block px-2.5 py-1 text-[13px] text-link hover:underline"
            >
              Add client
            </Link>
          </div>
        )}
      </div>

      {/* 5. Recents Section */}
      <div className="px-2 pt-5 flex-1 overflow-y-auto">
        <div className="px-2.5 py-1 text-[13px] font-medium text-text-muted">
          Recents
        </div>
        <div className="px-2.5 py-1 text-[13px] text-text-muted">
          Nothing here yet
        </div>
      </div>

      {/* 6. User Profile Footer (Tega) */}
      <div className="relative px-2 py-2 border-t border-border/30">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center justify-between w-full px-2.5 py-2 text-[14px] rounded-sm text-text hover:bg-surface-hover transition-colors focus-ring"
          aria-expanded={userMenuOpen}
          aria-label="User menu"
        >
          <span className="font-medium truncate">Tega</span>
          <ChevronGlyph
            direction={userMenuOpen ? 'up' : 'down'}
            className="w-3 h-3 text-text-muted"
          />
        </button>

        {userMenuOpen && (
          <div
            className="absolute bottom-full left-2 right-2 mb-1.5 p-1.5 bg-surface text-text rounded-md shadow-soft border border-border/40 z-30 select-none animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/settings"
              onClick={() => {
                setUserMenuOpen(false);
                onCloseMobile();
              }}
              className="block px-2.5 py-1.5 text-[13px] text-text rounded-sm hover:bg-surface-hover transition-colors"
            >
              Settings
            </Link>

            <div className="my-1 border-t border-border/40" />

            <div className="px-2.5 py-1 text-[11px] font-medium text-text-muted">
              Appearance
            </div>
            <div className="grid grid-cols-3 gap-1 px-1 py-1">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 text-[12px] rounded-sm transition-colors ${
                  theme === 'light'
                    ? 'bg-accent text-white font-medium'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 text-[12px] rounded-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-accent text-white font-medium'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`px-2 py-1 text-[12px] rounded-sm transition-colors ${
                  theme === 'system'
                    ? 'bg-accent text-white font-medium'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
              >
                System
              </button>
            </div>

            <div className="my-1 border-t border-border/40" />

            <Link
              href="/settings#shortcuts"
              onClick={() => {
                setUserMenuOpen(false);
                onCloseMobile();
              }}
              className="block px-2.5 py-1.5 text-[13px] text-text rounded-sm hover:bg-surface-hover transition-colors"
            >
              Keyboard shortcuts
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet static sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 ease-in-out border-r border-border/40 overflow-hidden ${
          collapsed ? 'w-0 border-r-0' : 'w-[260px]'
        }`}
      >
        <div className="w-[260px] h-full">{sidebarContent}</div>
      </aside>

      {/* Mobile Slide-over Drawer (<768px) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-[2px]"
          onClick={onCloseMobile}
        >
          <div
            className="w-[260px] h-full bg-sidebar shadow-soft transform transition-transform duration-200 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
