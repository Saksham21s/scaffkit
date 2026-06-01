# Prism — Common Components

> **Reusable composite components** — KPI grids, hero sections, search bars, empty states, error boundaries, view toggles.

## 📦 Components Included

| Component | Description |
|-----------|-------------|
| **KpiGrid** | Auto-grid of StatsCards with loading/empty states |
| **EntityHeroSection** | Entity detail page hero — avatar, identity, metadata, stats |
| **SearchBar** | Debounced search input with clear button |
| **EmptyState** | Zero-data display with icon, message, action |
| **ErrorBoundary** | React error boundary with fallback UI |
| **ViewToggle** | Grid/List view switcher |

---

## 📊 KpiGrid

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `KpiItem[]` | `[]` | KPI card configuration array |
| `loading` | `boolean` | `false` | Show skeleton grid |
| `columns` | `number` | `4` | Grid columns |
| `gap` | `string` | `"1.5rem"` | Grid gap |
| `emptyIcon` | `React.ComponentType` | `Database` | Empty state icon |
| `emptyTitle` | `string` | `"No Metrics Available"` | Empty state title |
| `emptyDescription` | `string` | `"No statistical data..."` | Empty state description |
| `variant` | `"premium" \| "nx"` | `"premium"` | StatsCard variant |
| `className` | `string` | — | Additional classes |

### KpiItem Interface

```typescript
interface KpiItem {
  key: string;
  title: string;
  value: string | number;
  trend?: string;
  icon?: React.ComponentType;
  color?: string;
  description?: string;
  isPositive?: boolean;
}
```

### Usage

```jsx
<KpiGrid
  items={[
    { key: "revenue", title: "Revenue", value: "$124.5K", trend: "+12.5%", icon: DollarSign, color: "var(--primary)", isPositive: true },
    { key: "users", title: "Active Users", value: "2,847", trend: "+8.3%", icon: Users, color: "var(--success)", isPositive: true },
    { key: "bounce", title: "Bounce Rate", value: "24.1%", trend: "-3.2%", icon: TrendingDown, color: "var(--error)", isPositive: false },
    { key: "sessions", title: "Avg. Session", value: "4m 32s", icon: Clock, color: "var(--info)", description: "Last 30 days" },
  ]}
  loading={isLoading}
  columns={4}
  variant="premium"
/>
```

### States
| State | Display |
|-------|---------|
| **Loading** | 4 skeleton cards in grid |
| **Empty** | EmptyState component with icon + message |
| **Populated** | StatsCards in responsive grid |

---

## 🦸 EntityHeroSection

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatarUrl` | `string` | — | Avatar image URL |
| `avatarInitials` | `string` | — | Initials fallback |
| `avatarGradient` | `string` | — | Gradient class for fallback |
| `name` | `string` | required | Entity name (h1) |
| `description` | `string` | — | Description paragraph |
| `idBadgeText` | `string` | — | ID badge text (e.g., "USR-001") |
| `idBadgeVariant` | `"default" \| "success" \| "warning" \| "danger"` | `"default"` | ID badge color |
| `badges` | `{ label, variant }[]` | `[]` | Status/tag badges |
| `metadata` | `{ icon, text }[]` | `[]` | Metadata chips |
| `stats` | `{ label, value }[]` | `[]` | Footer stats row |
| `controls` | `ReactNode` | — | Control buttons (left side) |
| `action` | `ReactNode` | — | Primary action (right side) |
| `hideAvatar` | `boolean` | `false` | Hide avatar entirely |

### Features
- **Framer Motion** — Spring animation on mount (opacity + y)
- **Hover Glow** — Border + shadow on hover
- **Responsive** — Flex layout, stacks on mobile
- **Rich Metadata** — Chips with icons
- **Stat Bar** — Bottom divider with bullet-separated stats

### Usage

```jsx
<EntityHeroSection
  name="Rahul Sharma"
  avatarInitials="RS"
  avatarGradient="from-emerald-500 to-teal-500"
  description="Senior software engineer with 8+ years of experience in full-stack development."
  idBadgeText="USR-001"
  idBadgeVariant="success"
  metadata={[
    { icon: Mail, text: "rahul@example.com" },
    { icon: MapPin, text: "Mumbai, India" },
    { icon: Briefcase, text: "Engineering" },
  ]}
  badges={[
    { label: "Full-time", variant: "success" },
    { label: "Senior", variant: "info" },
  ]}
  stats={[
    { label: "Projects", value: "12" },
    { label: "Tasks", value: "48" },
    { label: "Completed", value: "36" },
    { label: "Team", value: "8" },
  ]}
  controls={<Button variant="secondary" size="sm">Assign</Button>}
  action={<Button variant="primary" size="sm">Edit Profile</Button>}
/>
```

---

## 🔍 SearchBar

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Search value |
| `onChange` | `(value) => void` | required | Change handler |
| `placeholder` | `string` | `"Search..."` | Placeholder text |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Input size |
| `debounceMs` | `number` | `300` | Debounce delay |
| `className` | `string` | — | Additional classes |

### Features
- **Debounced** — 300ms default debounce
- **Clear Button** — X icon when value present
- **Search Icon** — Left-side magnifying glass
- **Keyboard Shortcut** — Cmd+K to focus (optional)

---

## 📦 EmptyState

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ComponentType` | `Search` | Icon component |
| `title` | `string` | `"No data found"` | Empty state title |
| `description` | `string` | — | Description text |
| `action` | `ReactNode` | — | Action button/link |
| `className` | `string` | — | Additional classes |

### Usage

```jsx
<EmptyState
  icon={Inbox}
  title="No messages yet"
  description="When you receive messages, they will appear here."
  action={<Button onClick={compose}>Compose Message</Button>}
/>
```

---

## 🛡️ ErrorBoundary

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |
| `fallback` | `ReactNode \| (error, reset) => ReactNode` | — | Custom fallback UI |
| `onError` | `(error, errorInfo) => void` | — | Error callback |

### Features
- **Error State** — Catches render errors
- **Reset Handler** — `resetErrorBoundary` to retry
- **Dev Logging** — Console error details in development
- **Custom Fallback** — Render prop for full control

### Usage

```jsx
<ErrorBoundary
  fallback={(error, reset) => (
    <EmptyState
      icon={AlertTriangle}
      title="Something went wrong"
      description={error.message}
      action={<Button onClick={reset}>Try Again</Button>}
    />
  )}
>
  <ExpensiveFeature />
</ErrorBoundary>
```

---

## 👁️ ViewToggle

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `views` | `{ key, label, icon }[]` | required | View options |
| `activeView` | `string` | required | Current view |
| `onChange` | `(key) => void` | required | View change handler |
| `size` | `"sm" \| "md"` | `"md"` | Toggle size |

### Usage

```jsx
<ViewToggle
  views={[
    { key: "grid", label: "Grid", icon: LayoutGrid },
    { key: "list", label: "List", icon: List },
  ]}
  activeView={view}
  onChange={setView}
  size="sm"
/>
```

---

## 📊 Common Components Stats

| Component | Lines | Dependencies | Features |
|-----------|-------|-------------|----------|
| KpiGrid | ~50 | StatsCard, EmptyState | 3 states |
| EntityHeroSection | ~180 | Framer Motion | Staggered animation, 5 sections |
| SearchBar | ~60 | — | Debounce, clear, shortcut |
| EmptyState | ~40 | — | Icon, action slot |
| ErrorBoundary | ~50 | — | Error capture, reset |
| ViewToggle | ~50 | — | Segmented control |
| **Total** | **~430** | | |
