# Prism — UI System Generator

## 🎯 Purpose

The UI System Generator creates a complete, production-ready design system for the generated project. It supports three styling approaches:

1. **Tailwind CSS** (recommended — default)
2. **Custom CSS** (design tokens + CSS modules)
3. **CSS Modules** (scoped class names)

---

## 🎨 Generated UI Structure

### Tailwind CSS Output

```
src/
├── styles/
│   ├── index.css          # Tailwind directives + globals
│   ├── animations.css     # Keyframe animations
│   └── forms.css          # Form element overrides
├── components/
│   ├── ui/
│   │   ├── Button.jsx     # Button variants
│   │   ├── Input.jsx      # Form inputs
│   │   ├── Badge.jsx      # Status badges
│   │   ├── Card.jsx       # Card system
│   │   ├── Modal.jsx      # Modal dialog
│   │   ├── Select.jsx     # Select dropdown
│   │   ├── Tabs.jsx       # Tab navigation
│   │   ├── Switch.jsx     # Toggle switch
│   │   ├── Spinner.jsx    # Loading spinner
│   │   ├── Toast.jsx      # Toast notifications
│   │   ├── Tooltip.jsx    # Tooltip
│   │   ├── Skeleton.jsx   # Loading skeleton
│   │   ├── Avatar.jsx     # User avatar
│   │   ├── Dropdown.jsx   # Dropdown menu
│   │   ├── DataTable.jsx  # Data table
│   │   ├── Pagination.jsx # Pagination
│   │   ├── EmptyState.jsx # Empty state
│   │   ├── ErrorBoundary.jsx # Error boundary
│   │   └── index.js       # Barrel exports
│   ├── layout/
│   │   ├── DashboardLayout.jsx  # Main layout
│   │   ├── Sidebar.jsx          # Sidebar nav
│   │   ├── Header.jsx           # Top header
│   │   └── AuthLayout.jsx       # Auth pages layout
│   └── common/
│       ├── SearchBar.jsx
│       ├── Breadcrumbs.jsx
│       └── index.js
├── tailwind.config.js    # Extended config
└── postcss.config.js     # PostCSS config
```

### Custom CSS Output

```
src/
├── styles/
│   ├── tokens.css        # Design tokens (colors, spacing, typography)
│   ├── reset.css         # CSS reset
│   ├── base.css          # Base element styles
│   ├── components.css    # Component classes
│   ├── utilities.css     # Utility classes
│   ├── animations.css    # Animations
│   ├── forms.css         # Form styles
│   └── index.css         # Main import
├── components/
│   ├── ui/
│   │   └── [Component].jsx + [Component].css
│   ├── layout/
│   └── common/
```

---

## ⚙️ Tailwind Config Generator

```typescript
// generators/ui-generator.ts
class UIGenerator implements Generator {
  name = "UI System Generator";
  priority = 350;

  async generate(config: PrismConfig): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    if (config.tech.styling === "tailwind") {
      files.push(...this.generateTailwindFiles(config));
    } else if (config.tech.styling === "custom-css") {
      files.push(...this.generateCustomCSSFiles(config));
    } else {
      files.push(...this.generateCSSModulesFiles(config));
    }

    // Shared UI components — generated for all styling approaches
    files.push(...this.generateUIComponents(config));
    files.push(...this.generateLayoutComponents(config));

    return files;
  }
}
```

### Tailwind Config

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary palette — fully customizable
        primary: {
          50: "var(--primary-50, #eff6ff)",
          100: "var(--primary-100, #dbeafe)",
          200: "var(--primary-200, #bfdbfe)",
          300: "var(--primary-300, #93c5fd)",
          400: "var(--primary-400, #60a5fa)",
          500: "var(--primary-500, #3b82f6)",  // Default primary
          600: "var(--primary-600, #2563eb)",
          700: "var(--primary-700, #1d4ed8)",
          800: "var(--primary-800, #1e40af)",
          900: "var(--primary-900, #1e3a8a)",
          950: "var(--primary-950, #172554)",
        },
        // Semantic colors
        success: "var(--color-success, #10b981)",
        warning: "var(--color-warning, #f59e0b)",
        error: "var(--color-error, #ef4444)",
        info: "var(--color-info, #3b82f6)",
        // Surface colors
        surface: {
          DEFAULT: "var(--surface-bg, #ffffff)",
          secondary: "var(--surface-secondary, #f8fafc)",
          tertiary: "var(--surface-tertiary, #f1f5f9)",
        },
        // Text colors
        text: {
          primary: "var(--text-primary, #0f172a)",
          secondary: "var(--text-secondary, #475569)",
          muted: "var(--text-muted, #94a3b8)",
          inverse: "var(--text-inverse, #ffffff)",
        },
        border: {
          DEFAULT: "var(--border-color, #e2e8f0)",
          strong: "var(--border-strong, #cbd5e1)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      spacing: {
        // Consistent spacing scale
      },
      borderRadius: {
        DEFAULT: "var(--radius-base, 0.5rem)",
        sm: "var(--radius-sm, 0.375rem)",
        lg: "var(--radius-lg, 0.75rem)",
        xl: "var(--radius-xl, 1rem)",
      },
      boxShadow: {
        card: "var(--shadow-card, 0 1px 3px 0 rgb(0 0 0 / 0.1))",
        dropdown: "var(--shadow-dropdown, 0 4px 6px -1px rgb(0 0 0 / 0.1))",
        modal: "var(--shadow-modal, 0 20px 25px -5px rgb(0 0 0 / 0.1))",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "spin-slow": "spin 2s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🎨 Custom CSS Design Tokens Generator

For non-Tailwind projects, Prism generates a complete design token system:

```css
/* src/styles/tokens.css */

/* ── Color Palette ──────────────────────────────────── */
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Surface — Light Mode */
  --surface-bg: #ffffff;
  --surface-secondary: #f8fafc;
  --surface-tertiary: #f1f5f9;
  --surface-sidebar: #1e293b;

  /* Text — Light Mode */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  /* Border */
  --border-color: #e2e8f0;
  --border-strong: #cbd5e1;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Typography */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-base: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-dropdown: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-modal: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-tooltip: 500;
}

/* ── Dark Mode ──────────────────────────────────────── */
body.dark-mode {
  --surface-bg: #0f172a;
  --surface-secondary: #1e293b;
  --surface-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0f172a;
  --border-color: #334155;
  --border-strong: #475569;
}
```

---

## 🧩 UI Component Generator

Prism generates complete, production-ready UI components for all styling approaches.

### Button Component (Tailwind)

```jsx
// src/components/ui/Button.jsx
import { forwardRef } from "react";
import { cn } from "@shared/lib/cn";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500",
  secondary:
    "bg-surface-secondary text-text-primary border border-border hover:bg-surface-tertiary focus-visible:ring-primary-500",
  outline:
    "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 focus-visible:ring-primary-500",
  ghost:
    "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary focus-visible:ring-primary-500",
  danger:
    "bg-error text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-error",
};

const sizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    icon: Icon,
    children,
    className,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center gap-2 font-medium rounded-base",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
});
```

### Card Component (Custom CSS)

```jsx
// src/components/ui/Card.jsx
import { cn } from "@shared/lib/cn";
import styles from "./Card.module.css";

export function Card({ variant = "default", padding = "md", children, className, ...props }) {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn(styles.header, className)}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className }) {
  return <div className={cn(styles.body, className)}>{children}</div>;
};
```

```css
/* Card.module.css */
.card {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-dropdown);
}

.default { }
.bento {
  border: none;
  box-shadow: none;
  background: var(--surface-secondary);
}
.stats {
  text-align: center;
  padding: var(--space-6);
}

.padding-none { padding: 0; }
.padding-sm { padding: var(--space-3); }
.padding-md { padding: var(--space-5); }
.padding-lg { padding: var(--space-8); }

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}

.title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.subtitle {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.body { }
.action { flex-shrink: 0; }
```

---

## 🌗 Theme Provider Generator

```jsx
// src/shared/core/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "prism-theme-mode";
const COLOR_STORAGE_KEY = "prism-theme-color";

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || "light";
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem(COLOR_STORAGE_KEY) || "blue";
  });

  // Apply theme to body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);

    localStorage.setItem(THEME_STORAGE_KEY, mode);
    localStorage.setItem(COLOR_STORAGE_KEY, accentColor);
  }, [mode, accentColor]);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((newMode) => {
    setModeState(newMode);
  }, []);

  const setAccent = useCallback((newColor) => {
    setAccentColor(newColor);
    document.documentElement.setAttribute("data-accent", newColor);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accentColor,
        toggleTheme,
        setTheme,
        setAccent,
        isDark: mode === "dark",
        isLight: mode === "light",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

---

## 📐 Layout Components Generator

### DashboardLayout

```jsx
// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@shared/lib/cn";

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarCollapsed((prev) => !prev)} />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-6",
            "transition-all duration-200"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

## 🧪 Accessibility Generator

Every UI component includes built-in accessibility:

```jsx
// src/components/ui/Modal.jsx
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@shared/lib/cn";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Trap focus
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      onClose?.();
      return;
    }
    if (e.key === "Tab") {
      const focusable = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  // Manage body scroll + focus
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      contentRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-modal flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Content */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={cn(
          "relative bg-surface-bg rounded-xl shadow-modal",
          "animate-scale-in",
          "p-6 max-h-[85vh] overflow-y-auto",
          "focus:outline-none",
          sizes[size]
        )}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-surface-tertiary transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

const sizes = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-lg",
  lg: "w-full max-w-2xl",
  xl: "w-full max-w-4xl",
  full: "w-full max-w-full mx-4",
};
```

---

## 📊 UI System Stats

| Component | Lines | Accessibility | Variants |
|-----------|-------|--------------|----------|
| **Button** | ~120 | ✅ ARIA, focus-visible, disabled | 5 variants, 5 sizes |
| **Input** | ~80 | ✅ label, error, description | 3 variants |
| **Card** | ~100 | ✅ semantic HTML | 3 variants |
| **Modal** | ~130 | ✅ focus trap, escape, ARIA | 5 sizes |
| **Badge** | ~60 | ✅ status colors | 5 variants |
| **Select** | ~150 | ✅ combobox pattern | With/without search |
| **Tabs** | ~110 | ✅ tablist, tabpanel | 2 styles |
| **Switch** | ~70 | ✅ role="switch", aria-checked | With label |
| **Toast** | ~100 | ✅ aria-live="polite" | 4 types |
| **Tooltip** | ~90 | ✅ role="tooltip", keyboard | Position variants |
| **Skeleton** | ~50 | ✅ aria-busy | 3 shapes |
| **Avatar** | ~60 | ✅ alt text, fallback | 3 sizes |
| **Dropdown** | ~140 | ✅ menu pattern, keyboard | Position variants |
| **DataTable** | ~200 | ✅ aria-sort, row roles | Sortable, selectable |
| **Pagination** | ~80 | ✅ aria-current, keyboard | Page sizes |
| **Total** | **~1,540** | | |

---

## 🎯 Design Decision Guide

| Decision | Tailwind | Custom CSS | CSS Modules |
|----------|----------|------------|-------------|
| **Setup time** | 2 min | 15 min | 5 min |
| **Bundle size** | ~15KB (purged) | ~10KB | ~12KB |
| **Customization** | Config-based | Full control | Per-component |
| **Dark mode** | Built-in | Manual | Manual |
| **Learning curve** | Medium | Low | Low |
| **Team preference** | Most popular | Legacy | Enterprise |
