/**
 * Design Token Template
 * Clean CSS custom properties — no excessive shades.
 * Tailwind for layout. Custom CSS for colors & tokens.
 * Full light + dark mode.
 */
export function buildTokensCSS(): string {
  return `/* ══════════════════════════════════════
   DOCIFY DESIGN TOKENS
   ══════════════════════════════════════ */

@layer base {
  :root {
    /* ── Core Palette ── */
    --color-primary: #3b82f6;
    --color-primary-hover: #2563eb;
    --color-primary-active: #1d4ed8;
    --color-primary-subtle: #eff6ff;

    --color-secondary: #8b5cf6;
    --color-secondary-hover: #7c3aed;

    --color-tertiary: #06b6d4;
    --color-tertiary-hover: #0891b2;

    /* ── Semantic ── */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #3b82f6;

    --color-success-bg: #d1fae5;
    --color-warning-bg: #fef3c7;
    --color-error-bg: #fee2e2;
    --color-info-bg: #dbeafe;

    /* ── Surfaces ── */
    --surface: #ffffff;
    --surface-subtle: #f8fafc;
    --surface-muted: #f1f5f9;
    --surface-inverse: #0f172a;

    /* ── Text ── */
    --text: #0f172a;
    --text-subtle: #475569;
    --text-muted: #94a3b8;
    --text-inverse: #ffffff;

    /* ── Borders ── */
    --border: #e2e8f0;
    --border-strong: #cbd5e1;

    /* ── Typography ── */
    --font-sans: "Inter", system-ui, -apple-system, sans-serif;
    --font-mono: "JetBrains Mono", "Fira Code", monospace;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;

    /* ── Spacing ── */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    --space-16: 4rem;

    /* ── Radii ── */
    --radius-sm: 0.375rem;
    --radius: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 9999px;

    /* ── Shadows ── */
    --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px rgb(0 0 0 / 0.1);

    /* ── Transitions ── */
    --transition: 200ms ease;

    /* ── Z-Index ── */
    --z-dropdown: 100;
    --z-modal: 500;
    --z-toast: 600;
    --z-tooltip: 700;

    /* ── Charts ── */
    --chart-1: #3b82f6;
    --chart-2: #10b981;
    --chart-3: #f59e0b;
    --chart-4: #ef4444;
    --chart-5: #8b5cf6;
    --chart-6: #ec4899;
  }

  .dark {
    --color-primary-hover: #60a5fa;
    --color-primary-active: #93c5fd;
    --color-primary-subtle: #172554;

    --color-success-bg: #064e3b;
    --color-warning-bg: #78350f;
    --color-error-bg: #7f1d1d;
    --color-info-bg: #1e3a5f;

    --surface: #0f172a;
    --surface-subtle: #1e293b;
    --surface-muted: #334155;
    --surface-inverse: #ffffff;

    --text: #f1f5f9;
    --text-subtle: #94a3b8;
    --text-muted: #64748b;

    --border: #334155;
    --border-strong: #475569;

    --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.3);
    --shadow: 0 1px 3px rgb(0 0 0 / 0.4);
    --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.4);
    --shadow-xl: 0 20px 25px rgb(0 0 0 / 0.4);
  }

  * { border-color: var(--border); }

  body {
    font-family: var(--font-sans);
    background: var(--surface);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: var(--radius-full); }
  ::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }
}
`;
}
