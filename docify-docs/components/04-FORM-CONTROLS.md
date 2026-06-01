# Prism — Form Controls

> **Production-grade form components** — accessible, animated, with error states, dark mode, and full customization.

## 📦 Components Included

| Component | Description |
|-----------|-------------|
| **Input** | Text input with label, error, description, icon |
| **Select** | Rich select with search, chips, dropdown |
| **StatusDropdown** | Color-coded status selector |
| **Switch** | Toggle switch with label |
| **Toggle** | Button group toggle (left/right) |
| **DatePicker** | Single date picker with calendar |
| **DateRangePicker** | Date range selector with sidebar presets |

---

## ⌨️ Input

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Input label |
| `error` | `string` | — | Error message (shows red state) |
| `description` | `string` | — | Helper description text |
| `icon` | `React.ComponentType` | — | Left-side icon |
| `fullWidth` | `boolean` | `false` | Width: 100% |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Input size |
| `variant` | `"outline" \| "filled" \| "flushed"` | `"outline"` | Visual variant |
| `...rest` | `InputHTMLAttributes` | — | All standard input props |

### Usage

```jsx
<Input
  label="Email Address"
  placeholder="name@company.com"
  icon={Mail}
  description="We'll never share your email"
  error={errors.email}
  size="md"
  fullWidth
/>
```

### States

| State | Visual | Implementation |
|-------|--------|----------------|
| Default | Border + subtle shadow | — |
| Focus | Primary ring + border | `:focus-visible` |
| Error | Red border + error text | `error` prop |
| Disabled | Opacity 50% | `disabled` prop |
| With Icon | Left-padded icon | `icon` prop |

---

## 📋 Select

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ value, label }[]` | required | Selectable options |
| `value` | `any` | — | Current value |
| `onChange` | `(value) => void` | — | Change handler |
| `placeholder` | `string` | `"Select..."` | Placeholder text |
| `label` | `string` | — | Field label |
| `error` | `string` | — | Error message |
| `searchable` | `boolean` | `false` | Enable search within options |
| `multi` | `boolean` | `false` | Multi-select mode |
| `clearable` | `boolean` | `false` | Show clear button |
| `fullWidth` | `boolean` | `false` | Width: 100% |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Select size |

### Features
- **Searchable** — Filter options by typing
- **Multi-Select** — Chips display for multiple values
- **Clearable** — X button to reset selection
- **Portal Dropdown** — Renders in portal to avoid overflow clipping
- **Keyboard Navigation** — Arrow keys + Enter/Escape
- **Auto-Close** — Closes on outside click

### Usage

```jsx
<Select
  label="Assign Team Member"
  options={teamMembers.map(m => ({ value: m.id, label: m.name }))}
  value={selectedId}
  onChange={setSelectedId}
  searchable
  clearable
  placeholder="Search team members..."
  fullWidth
/>

{/* Multi-select */}
<Select
  label="Tags"
  options={tags}
  value={selectedTags}
  onChange={setSelectedTags}
  multi
  clearable
/>
```

---

## 🎨 StatusDropdown

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Current status value |
| `options` | `{ value, label, color }[]` | required | Status options with colors |
| `onChange` | `(value) => void` | — | Change handler |
| `size` | `"sm" \| "md"` | `"sm"` | Dropdown size |
| `disabled` | `boolean` | `false` | Disabled state |

### Features
- **Color-Coded** — Status badge changes color with selection
- **Compact** — Inline display, ideal for DataTable cells
- **Click-to-Edit** — Click badge to open dropdown options

### Usage

```jsx
const statusOptions = [
  { value: "active", label: "Active", color: "success" },
  { value: "pending", label: "Pending", color: "warning" },
  { value: "suspended", label: "Suspended", color: "danger" },
  { value: "archived", label: "Archived", color: "neutral" },
];

<StatusDropdown
  value={status}
  options={statusOptions}
  onChange={handleStatusChange}
  size="sm"
/>
```

---

## 🔄 Switch

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Toggle state |
| `onChange` | `(checked) => void` | — | Change handler |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Helper text |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `"sm" \| "md"` | `"md"` | Switch size |

### Features
- **Accessible** — `role="switch"`, `aria-checked`
- **Smooth Animation** — Translate + background transition
- **Label + Description** — Side-by-side text layout

### Usage

```jsx
<Switch
  checked={notifications}
  onChange={setNotifications}
  label="Enable Notifications"
  description="Receive alerts for important updates"
/>
```

---

## 🔘 Toggle

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ value, label }[]` | required | Toggle options |
| `value` | `any` | — | Current value |
| `onChange` | `(value) => void` | — | Change handler |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Toggle size |

### Features
- **Segmented Control** — Button group style
- **Active Slider** — Smooth sliding indicator
- **Equal Width** — All options same width

### Usage

```jsx
<Toggle
  options={[
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" },
  ]}
  value={period}
  onChange={setPeriod}
  size="md"
/>
```

---

## 📅 DatePicker

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | — | Selected date |
| `onChange` | `(date) => void` | — | Date change handler |
| `label` | `string` | — | Field label |
| `placeholder` | `string` | `"Select date"` | Placeholder |
| `minDate` | `Date` | — | Minimum selectable date |
| `maxDate` | `Date` | — | Maximum selectable date |
| `error` | `string` | — | Error message |
| `fullWidth` | `boolean` | `false` | Width: 100% |

### Features
- **Calendar Dropdown** — Month grid with navigation
- **Today Highlight** — Current date indicator
- **Disabled Dates** — Min/max range enforcement
- **Month Navigation** — Prev/Next month arrows
- **Outside Click Close** — Auto-close dropdown

---

## 📆 DateRangePicker

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startDate` | `Date \| null` | — | Range start |
| `endDate` | `Date \| null` | — | Range end |
| `onChange` | `(start, end) => void` | — | Range change handler |
| `label` | `string` | — | Field label |
| `presets` | `{ label, getValue }[]` | presets | Quick-select presets |
| `error` | `string` | — | Error message |
| `fullWidth` | `boolean` | `false` | Width: 100% |

### Default Presets

```javascript
const DEFAULT_PRESETS = [
  { label: "Today", getValue: () => [new Date(), new Date()] },
  { label: "This Week", getValue: () => [startOfWeek(new Date()), endOfWeek(new Date())] },
  { label: "This Month", getValue: () => [startOfMonth(new Date()), endOfMonth(new Date())] },
  { label: "Last 7 Days", getValue: () => [subDays(new Date(), 7), new Date()] },
  { label: "Last 30 Days", getValue: () => [subDays(new Date(), 30), new Date()] },
  { label: "This Quarter", getValue: () => [startOfQuarter(new Date()), endOfQuarter(new Date())] },
  { label: "This Year", getValue: () => [startOfYear(new Date()), endOfYear(new Date())] },
];
```

### Features
- **Dual Calendar** — Side-by-side month grids
- **Sidebar Presets** — Quick-select common ranges
- **Range Highlight** — Visual connection between start/end
- **Hover Preview** — See range before clicking end date
- **Single Click** — Apply preset ranges instantly

---

## 🎨 Styling — Form Tokens

```css
/* Form-specific tokens */
:root {
  --input-bg: var(--surface-bg);
  --input-border: var(--border-color);
  --input-focus-ring: var(--primary);
  --input-error: var(--error);
  --input-radius: var(--radius-lg);
  --input-height-sm: 32px;
  --input-height-md: 40px;
  --input-height-lg: 48px;
  --label-color: var(--text-primary);
  --description-color: var(--text-muted);
  --error-color: var(--error);
}
```

---

## 📊 Form Controls Stats

| Component | Lines | Dependencies | Features |
|-----------|-------|-------------|----------|
| Input | ~80 | — | 3 variants, 3 sizes, icon, error |
| Select | ~150 | — | Searchable, multi, clearable, portal |
| StatusDropdown | ~80 | — | Color-coded, inline editing |
| Switch | ~70 | — | Role="switch", animation |
| Toggle | ~60 | — | Segmented control, sliding |
| DatePicker | ~120 | date-fns | Calendar, min/max, navigation |
| DateRangePicker | ~180 | date-fns | Dual calendar, presets, sidebar |
| **Total** | **~740** | | |
