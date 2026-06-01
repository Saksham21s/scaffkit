# Prism — Card System

> **Enterprise-grade card system** — 7 variants, compound components, skeleton loading, animations.

## 📦 Components Included

| Component | File | Purpose |
|-----------|------|---------|
| **Card** | `Card.jsx` | Root card container — 7 variants |
| **StatsCard** | `StatsCard.jsx` | KPI/stat display card |
| **StatsGrid** | `StatsCard.jsx` | Auto-grid container for StatsCards |
| **BentoCard** | `BentoCard.jsx` | Bento-grid layout card (Framer Motion) |
| **EntityCard** | `EntityCard.jsx` | Rich entity card with avatar, stats, actions |
| **AssignCard** | `AssignCard.jsx` | Assignment management card with popover |
| **CardBadge** | `CardBadge.jsx` | Corner badge for cards |

---

## 🃏 Card (Root)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "flat" \| "outline" \| "glass" \| "elevated" \| "pro" \| "nx"` | `"default"` | Visual variant |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Inner padding |
| `hover` | `boolean` | `false` | Enable hover elevation effect |
| `onClick` | `() => void` | — | Click handler (adds cursor) |
| `className` | `string` | — | Additional classes |

### Sub-components

| Sub-component | Props | Description |
|---------------|-------|-------------|
| `Card.Header` | `children, className` | Card header section |
| `Card.Content` | `children, className` | Card body section |
| `Card.Skeleton` | `lines, showHeader, variant, height` | Loading skeleton |

### Variants

| Variant | Visual | Use Case |
|---------|--------|----------|
| `default` | White bg, border, shadow | Standard cards |
| `flat` | No border, subdued bg | Interior sections |
| `outline` | Border only, no bg | Settings panels |
| `glass` | Semi-transparent, blur | Overlay/drawer |
| `elevated` | Large shadow | Featured cards |
| `pro` | Gradient border | Premium sections |
| `nx` | Rounded + subtle glow | Dashboard metrics |

### Usage

```jsx
<Card variant="pro" hover padding="lg">
  <Card.Header>
    <h3>Revenue Overview</h3>
    <Button variant="ghost" size="sm">View All</Button>
  </Card.Header>
  <Card.Content>
    <RevenueChart data={revenueData} />
  </Card.Content>
</Card>

<Card.Skeleton variant="chart" height={300} lines={4} />
```

---

## 📈 StatsCard

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Metric label (uppercase, small) |
| `value` | `string \| number` | required | Main display value |
| `trend` | `string` | — | Trend indicator text |
| `icon` | `React.ComponentType` | — | Icon component (rendered in colored box) |
| `color` | `string` | `"var(--primary)"` | Icon + accent color |
| `loading` | `boolean` | `false` | Show skeleton |
| `variant` | `"nx" \| "premium"` | `"nx"` | Visual variant |
| `description` | `string` | — | Subtitle description |
| `isPositive` | `boolean` | `true` | Trend direction (affects color) |
| `className` | `string` | — | Additional classes |

### StatsGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number` | — | Grid columns count |
| `gap` | `string` | `"1.5rem"` | Grid gap |
| `className` | `string` | — | Additional classes |

### Usage

```jsx
<StatsGrid columns={4} gap="1rem">
  <StatsCard
    title="Total Revenue"
    value="$124,500"
    trend="+12.5%"
    icon={DollarSign}
    color="var(--primary)"
    isPositive
  />
  <StatsCard
    title="Active Users"
    value="2,847"
    trend="+8.3%"
    icon={Users}
    color="var(--success)"
    isPositive
  />
  <StatsCard
    title="Bounce Rate"
    value="24.1%"
    trend="-3.2%"
    icon={TrendingDown}
    color="var(--error)"
    isPositive={false}
  />
  <StatsCard
    title="Avg. Session"
    value="4m 32s"
    icon={Clock}
    color="var(--info)"
  />
</StatsGrid>
```

---

## 🧩 BentoCard

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card title |
| `subtitle` | `string` | — | Subtitle/description |
| `icon` | `React.ComponentType` | — | Header icon |
| `children` | `ReactNode` | — | Card body content |
| `action` | `ReactNode` | — | Header action element |
| `titleExtra` | `ReactNode` | — | Extra element next to title |
| `span` | `number` | `1` | CSS grid column span |
| `delay` | `number` | `0` | Animation delay (stagger) |
| `className` | `string` | — | Additional classes |

### Features
- **Framer Motion** — Spring animation on mount with configurable delay
- **Bento Grid** — Col-span support for CSS grid layouts
- **Icon Box** — Semi-transparent colored icon container

### Usage

```jsx
<div className="grid grid-cols-3 gap-4">
  <BentoCard
    title="Revenue Overview"
    subtitle="Monthly performance metrics"
    icon={TrendingUp}
    span={2}
    delay={0}
  >
    <RevenueChart />
  </BentoCard>

  <BentoCard
    title="Quick Actions"
    icon={Zap}
    span={1}
    delay={0.1}
    action={<Button size="sm">New</Button>}
  >
    <QuickActionList />
  </BentoCard>
</div>
```

---

## 🆔 EntityCard

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| number` | required | Entity identifier |
| `onClick` | `(id) => void` | — | Click handler |
| `index` | `number` | `0` | Animation stagger index |
| `leftBadge` | `{ label, color }` | — | Top-left corner badge |
| `rightBadge` | `{ label, color }` | — | Top-right corner badge |
| `avatar` | `{ image, initials, gradient, size }` | — | Avatar config |
| `title` | `string` | required | Entity name |
| `subtitle` | `string` | — | Subtitle text |
| `subtitleIcon` | `React.ComponentType` | — | Icon for subtitle |
| `stats` | `{ label, value }[]` | `[]` | Stats grid (3-column) |
| `subtitleItems` | `{ icon, text, href }[]` | — | Rich metadata items |
| `footerLeft` | `ReactNode` | — | Footer left content |
| `onView` | `() => void` | — | View action |
| `onEdit` | `() => void` | — | Edit action |
| `onDelete` | `() => void` | — | Delete action |
| `children` | `ReactNode` | — | Content between header and footer |

### Features
- **Staggered Entry** — Fade-in-up animation with index-based delay
- **Glow Effect** — Subtle gradient glow on hover
- **Nested Bezel** — Double-border card architecture
- **Rich Metadata** — Multiple subtitle items with icons and separators
- **Action Reveal** — Actions appear on hover via opacity transition

### Usage

```jsx
<EntityCard
  id="usr-001"
  title="Rahul Sharma"
  subtitle="rahul@example.com"
  avatar={{ initials: "RS", size: "lg" }}
  stats={[
    { label: "Projects", value: "12" },
    { label: "Tasks", value: "48" },
    { label: "Completed", value: "36" },
  ]}
  subtitleItems={[
    { icon: Mail, text: "rahul@example.com" },
    { icon: Globe, text: "rahul.dev", href: "https://rahul.dev" },
  ]}
  rightBadge={{ label: "Active", color: "success" }}
  onView={() => navigate(`/users/usr-001`)}
  onEdit={() => openEditor("usr-001")}
  onDelete={() => confirmDelete("usr-001")}
/>
```

---

## 📎 AssignCard

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `member` | `{ id, name, assigned_projects?, assigned_forms? }` | required | Team member data |
| `isManager` | `boolean` | `false` | Show projects vs forms |
| `onAssign` | `(memberId, ids) => void` | — | Assignment handler |

### Features
- **Color Palette** — 6 rotating icon/avatar colors
- **Avatar Stack** — Overlapping circular avatars with +N overflow
- **Hover Popover** — Animated popover with assigned items list
- **Assign Modal** — Opens modal for adding assignments
- **Empty State** — "Assign Project/Form" button when none assigned
- **Smart Positioning** — Auto-adjusts popover position to viewport

---

## 🎨 Styling — Design Tokens

```css
/* Card tokens you can customize */
:root {
  --card-radius: var(--radius-lg);
  --card-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  --card-hover-shadow: 0 4px 12px rgb(0 0 0 / 0.06);
  --card-transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  --card-bg: var(--surface-bg);
  --card-border: var(--border-color);
}
```

---

## 📊 Card System Stats

| Component | Lines | Variants | Dependencies |
|-----------|-------|----------|-------------|
| Card | ~100 | 7 variants | cn utility |
| StatsCard | ~120 | 2 variants | Card, Skeleton |
| BentoCard | ~60 | — | Framer Motion |
| EntityCard | ~250 | — | CardBadge, TableActions, Avatar |
| AssignCard | ~280 | — | Modal, Button, Framer Motion |
| **Total** | **~810** | | |
