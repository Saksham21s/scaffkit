export function buildBaseCSS(): string {
  return `/* ══════════════════════════════════════
   DOCIFY BASE STYLES
   ══════════════════════════════════════ */

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
}

h1, h2, h3, h4 { font-weight: 600; line-height: 1.25; color: var(--text); }
h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }
h4 { font-size: var(--text-lg); }

p { color: var(--text-subtle); line-height: 1.625; }
a { color: var(--color-primary); transition: color var(--transition); }
a:hover { color: var(--color-primary-hover); }

code, pre { font-family: var(--font-mono); font-size: var(--text-sm); }
code {
  padding: 0.125em 0.375em;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
}

pre {
  padding: var(--space-4);
  border-radius: var(--radius);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  overflow-x: auto;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

::selection {
  background: var(--color-primary);
  color: var(--text-inverse);
}

.skeleton {
  background: var(--surface-muted);
  border-radius: var(--radius-sm);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;
}
