import React from 'react';

interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * 1. Sidebar Toggle Glyph
 * Universal pattern for expanding and collapsing the sidebar.
 */
export function SidebarToggleGlyph({ className = 'w-4 h-4', ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <path d="M6 2.5v11" />
    </svg>
  );
}

interface ChevronProps extends GlyphProps {
  direction?: 'down' | 'right' | 'up' | 'left';
}

/**
 * 2. Chevron Glyph
 * For expandable sidebar rows, tree expansion, and dropdown menus.
 */
export function ChevronGlyph({
  direction = 'down',
  className = 'w-3 h-3',
  ...props
}: ChevronProps) {
  const rotationClass = {
    down: 'rotate-0',
    right: '-rotate-90',
    up: 'rotate-180',
    left: 'rotate-90',
  }[direction];

  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform duration-150 ${rotationClass} ${className}`}
      {...props}
    >
      <path d="M2.5 4.5L6 8L9.5 4.5" />
    </svg>
  );
}

/**
 * 3. Ellipsis Glyph (Three dots)
 * Standard symbol for 'more' / page options menu.
 */
export function EllipsisGlyph({ className = 'w-4 h-4', ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  );
}

/**
 * 4. Close Glyph (x)
 * Standard symbol for dismiss in dialogs and mobile menus.
 */
export function CloseGlyph({ className = 'w-3.5 h-3.5', ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
    </svg>
  );
}
