'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { CommandPalette } from '@/components/ui/command-palette';

const SIDEBAR_STORAGE_KEY = 'horode-sidebar-collapsed';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Responsive initialization
    const width = window.innerWidth;
    let initialCollapsed = false;

    if (width >= 1280) {
      // 1280px and up: open by default, check localStorage override
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      initialCollapsed = saved ? saved === 'true' : false;
    } else if (width >= 768) {
      // 768 to 1279px: starts with sidebar collapsed
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      initialCollapsed = saved ? saved === 'true' : true;
    } else {
      // Mobile: sidebar is hidden drawer
      initialCollapsed = true;
    }

    setCollapsed(initialCollapsed);
    setMounted(true);
  }, []);

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    } catch {
      // Ignore localStorage errors
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text">
      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AppHeader
          sidebarCollapsed={collapsed}
          onToggleSidebar={handleToggleCollapse}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-[1120px] w-full mx-auto focus-ring">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}
