# Prism — UI Primitives

> **Foundational UI building blocks** — accessible, animated, production-ready with full dark mode support.

## 📦 Components Included

| Component | Description | Variants |
|-----------|-------------|----------|
| **Button** | Action button — 5 variants, 5 sizes, loading, icon support | 5 × 5 |
| **Badge** | Status/info badge — 5 semantic colors | 5 |
| **StatusBadge** | Color-coded status indicator with dot | 5+ |
| **Modal** | Dialog overlay with focus trap, escape close, animation | 5 sizes |
| **Tabs** | Tab navigation — 2 style variants | 2 styles |
| **Avatar** | User avatar with image/initials, gradient fallback | 3 sizes, 3 shapes |
| **Skeleton** | Loading placeholder shapes | 3 variants |
| **Tooltip** | Hover tooltip with portal | 4 positions |
| **Toast** | Notification toast — 4 types, auto-dismiss | 4 types |

---

## 🔘 Button

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"` | `"primary"` | Visual style |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Button size |
| `isLoading` | `boolean` | `false` | Show spinner + disable |
| `icon` | `React.ComponentType` | — | Left icon component |
| `disabled` | `boolean` | `false` | Disabled state |
| `children` | `ReactNode` | — | Button text |
| `className` | `string` | — | Additional classes |

### Variants

| Variant | Visual | Use Case |
|---------|--------|----------|
| `primary` | Filled primary bg | Main CTA |
| `secondary` | Subtle bg + border | Alternative action |
| `outline` | Border only, transparent | Secondary CTA |
| `ghost` | Text only, no border | Toolbar actions |
| `danger` | Red filled | Destructive actions |

### Sizes

| Size | Height | Font | Padding |
|------|--------|------|---------|
| `xs` | 24px | 12px | 8px × 8px |
| `sm` | 32px | 14px | 12px × 16px |
| `md` | 40px | 14px | 16px × 20px |
| `lg` | 48px | 16px | 24px × 32px |
| `xl` | 56px | 18px | 32px × 40px |

### Usage

```jsx
<Button variant="primary" size="md" onClick={handleSave}>
  Save Changes
</Button>

<Button variant="secondary" size="sm" icon={Plus}>
  Add Item
</Button>

<Button variant="danger" size="lg" isLoading={deleting}>
  Delete Account
</Button>

<Button variant="ghost" size="xs" icon={X} onClick={close} />
```

---

## 🏷️ Badge

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"` | `"neutral"` | Color variant |
| `size` | `"sm" \| "md"` | `"md"` | Badge size |
| `children` | `ReactNode` | — | Badge content |

### StatusBadge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `string` | required | Status text |
| `color` | `string` | — | Direct color override |
| `variant` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"` | — | Color variant |
| `size` | `"sm" \| "md"` | `"sm"` | Badge size |
| `dot` | `boolean` | `true` | Show colored dot |

### Usage

```jsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Suspended</Badge>
<Badge variant="info">In Progress</Badge>

<StatusBadge status="Completed" variant="success" />
<StatusBadge status="Failed" variant="danger" dot={false} />
```

---

## 💬 Modal

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Modal visibility |
| `onClose` | `() => void` | required | Close handler |
| `title` | `string` | — | Modal title |
| `children` | `ReactNode` | — | Modal content |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Modal width |
| `showCloseButton` | `boolean` | `true` | Show X button |

### Sub-components

| Sub-component | Purpose |
|---------------|---------|
| `Modal.Header` | Header with close button |
| `Modal.Title` | Title text (aria-labelledby) |
| `Modal.Body` | Scrollable content area |
| `Modal.Footer` | Action buttons footer |

### Accessibility Features
- **Focus Trap** — Tab/Shift+Tab cycle through focusable elements
- **Escape Close** — `onClose` on Escape key
- **Backdrop Click** — Close on overlay click
- **Body Scroll Lock** — `overflow: hidden` on body
- **ARIA** — `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Focus Restore** — Returns focus to trigger element on close

### Usage

```jsx
<Modal isOpen={open} onClose={close} size="lg">
  <Modal.Header>
    <Modal.Title>Edit User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <UserEditForm user={user} onSubmit={handleSave} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={handleSave}>Save</Button>
  </Modal.Footer>
</Modal>
```

---

## 📑 Tabs

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `{ key, label, content?, icon?, badge? }[]` | required | Tab definitions |
| `activeTab` | `string` | — | Active tab key |
| `onChange` | `(key) => void` | — | Tab change handler |
| `variant` | `"underline" \| "pill"` | `"underline"` | Tab style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tab size |
| `fullWidth` | `boolean` | `false` | Equal width tabs |

### Features
- **Controlled/Uncontrolled** — Both modes supported
- **Icons + Badges** — Tab label can include icon + count badge
- **Keyboard Nav** — Arrow keys to switch tabs
- **Animated Indicator** — Smooth sliding underline

### Usage

```jsx
<Tabs
  tabs={[
    { key: "overview", label: "Overview", content: <Overview /> },
    { key: "details", label: "Details", icon: Info, content: <Details /> },
    { key: "activity", label: "Activity", badge: 12, content: <Activity /> },
  ]}
  activeTab="overview"
  onChange={setTab}
  variant="underline"
/>
```

---

## 👤 Avatar

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | User name (for initials) |
| `image` | `string` | — | Image URL |
| `gradient` | `string` | `"from-primary to-primary/70"` | Gradient for fallback |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Avatar size |
| `shape` | `"circle" \| "rounded" \| "square"` | `"circle"` | Shape variant |
| `className` | `string` | — | Additional classes |

### Sizes

| Size | Dimensions | Font |
|------|-----------|------|
| `sm` | 28×28px | 10px |
| `md` | 36×36px | 12px |
| `lg` | 48×48px | 14px |

### Usage

```jsx
<Avatar name="Rahul Sharma" image="/path/to/photo.jpg" size="lg" />
<Avatar name="Priya Patel" gradient="from-purple-500 to-pink-500" size="md" />
<Avatar name="A" shape="rounded" size="sm" />
```

---

## 💀 Skeleton

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"text" \| "title" \| "rect" \| "circle"` | `"text"` | Shape variant |
| `width` | `string \| number` | `"100%"` | Skeleton width |
| `height` | `string \| number` | `"auto"` | Skeleton height |
| `borderRadius` | `string` | — | Border radius override |

### Presets

| Preset | Contents | Use Case |
|--------|----------|----------|
| `Skeleton` (base) | Single animated block | Custom shapes |
| `ChartSkeleton` | Chart-sized rect | Chart loading |
| `CardSkeleton` | Header + body lines | Card loading |

### Usage

```jsx
<Skeleton variant="title" width="60%" height="24px" />
<Skeleton variant="text" width="100%" />
<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="rect" width="100%" height="200px" borderRadius="var(--radius-lg)" />
```

---

## 💡 Tooltip

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | required | Tooltip content |
| `children` | `ReactNode` | required | Trigger element |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Tooltip position |
| `delay` | `number` | `200` | Show delay in ms |
| `className` | `string` | — | Additional classes |

### Features
- **Portal Rendering** — Avoids overflow clipping
- **Arrow Pointer** — CSS triangle pointing to trigger
- **Smooth Entry** — Fade + scale animation
- **Auto-position** — Viewport-aware placement

---

## 🔔 Toast

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"success" \| "error" \| "warning" \| "info"` | `"info"` | Toast type |
| `title` | `string` | — | Toast title |
| `description` | `string` | — | Toast description |
| `duration` | `number` | `4000` | Auto-dismiss duration |
| `onClose` | `() => void` | — | Close handler |
| `action` | `{ label, onClick }` | — | Action button |

### Usage (via notify utility)

```javascript
import { notify } from "@shared/utils/notify";

notify.success("User saved successfully");
notify.error("Failed to save user", { duration: 6000 });
notify.warning("Session about to expire", { action: { label: "Renew", onClick: renewSession } });
notify.info("New update available");
```

---

## 📊 UI Primitives Stats

| Component | Lines | Dependencies | A11y Features |
|-----------|-------|-------------|---------------|
| Button | ~80 | cn | focus-visible, disabled, ARIA |
| Badge | ~40 | — | Status colors, sr-only |
| Modal | ~130 | createPortal | Focus trap, escape, ARIA |
| Tabs | ~110 | — | Tablist pattern, keyboard nav |
| Avatar | ~60 | — | Alt text, initials fallback |
| Skeleton | ~50 | — | aria-busy |
| Tooltip | ~90 | createPortal | Role="tooltip" |
| Toast | ~100 | — | aria-live="polite" |
| **Total** | **~660** | | |
