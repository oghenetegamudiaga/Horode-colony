import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        sidebar: 'var(--sidebar)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
        },
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        link: 'var(--link)',
        tag: {
          spelling: {
            text: 'var(--tag-spelling-text)',
            bg: 'var(--tag-spelling-bg)',
          },
          grammar: {
            text: 'var(--tag-grammar-text)',
            bg: 'var(--tag-grammar-bg)',
          },
          consistency: {
            text: 'var(--tag-consistency-text)',
            bg: 'var(--tag-consistency-bg)',
          },
          leftover: {
            text: 'var(--tag-leftover-text)',
            bg: 'var(--tag-leftover-bg)',
          },
          style: {
            text: 'var(--tag-style-text)',
            bg: 'var(--tag-style-bg)',
          },
          unreadable: 'var(--tag-unreadable)',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
