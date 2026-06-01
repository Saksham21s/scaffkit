# Prism — DataTable System

> **Pre-built, production-grade data table** — sortable, resizable, searchable, paginated, exportable.

## 📦 Components Included

| Component | File | Purpose |
|-----------|------|---------|
| **DataTable** | `DataTable.jsx` | Root orchestrator — TanStack React Table wrapper |
| **TableToolbar** | `components/TableToolbar.jsx` | Search, filter, export controls |
| **TableHead** | `components/TableHead.jsx` | Sortable headers with resize handles |
| **TableBody** | `components/TableBody.jsx` | Rows, skeleton loading, overflow tooltips |
| **TablePagination** | `components/TablePagination.jsx` | Page nav, rows-per-page selector |
| **TableSelect** | `components/TableSelect.jsx` | Lightweight inline select (standalone) |
| **TableActions** | `components/TableActions.jsx` | View/Edit/Delete/Power action buttons |

---

## 📊 DataTable (Root)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef[]` | required | Column definitions (key, label, render, width, align, sortable, copyable) |
| `data` | `T[]` | `[]` | Row data array |
| `loading` | `boolean` | `false` | Shows 8-row skeleton when true |
| `emptyIcon` | `ReactNode` | `Search` | Icon for empty state |
| `emptyTitle` | `string` | `"No data found"` | Empty state title |
| `emptyDescription` | `string` | `"Adjust your filters..."` | Empty state description |
| `onRowClick` | `(row: T) => void` | — | Row click handler |
| `stickyFirstColumn` | `boolean` | `true` | Sticky first column |
| `stickyLastColumn` | `boolean` | `true` | Sticky actions column |
| `storageKey` | `string` | — | Persists column visibility + sizing to localStorage |
| `title` | `string` | — | Toolbar title |
| `showToolbar` | `boolean` | `false` | Show toolbar with search/export |
| `fileName` | `string` | — | PDF export filename |
| `search` | `string` | — | Current search value |
| `onSearchChange` | `(val: string) => void` | — | Search handler |
| `onRefresh` | `() => void` | — | Refresh data handler |
| `filters` | `ReactNode` | — | Filter controls rendered in toolbar |
| `pagination` | `{ total, pages, limit }` | — | Pagination metadata |
| `page` | `number` | `1` | Current page |
| `onPageChange` | `(page, limit) => void` | — | Page change handler |
| `isFiltered` | `boolean` | — | Filters active state |
| `onClearFilters` | `() => void` | — | Clear all filters |
| `rowClassName` | `string \| function` | — | Additional row class names |

### Column Definition

```typescript
interface ColumnDef {
  key: string;               // Accessor key
  label: string;             // Display header text
  render?: (value: any, row: T) => ReactNode;  // Custom cell renderer
  width?: number;            // Column width (default: 180)
  minWidth?: number;         // Min width (default: 120)
  align?: 'left' | 'center' | 'right';  // Text alignment
  sortable?: boolean;        // Enable sorting (default: true, false for actions)
  copyable?: boolean;        // Show copy button on hover
  resizable?: boolean;       // Enable resize handle (default: true)
}
```

### Usage Example

```jsx
const columns = [
  { key: "name", label: "Name", width: 200 },
  { key: "email", label: "Email", copyable: true, width: 250 },
  { key: "role", label: "Role", width: 150 },
  {
    key: "amount",
    label: "Amount",
    width: 150,
    align: "right",
    render: (val) => `$${val.toLocaleString()}`,
  },
  { key: "status", label: "Status", width: 130 },
  { key: "actions", label: "", width: 100, sortable: false },
];

<DataTable
  columns={columns}
  data={users}
  loading={isLoading}
  showToolbar
  storageKey="users-table"
  title="All Users"
  search={searchTerm}
  onSearchChange={setSearchTerm}
  pagination={{ total: 100, pages: 10, limit: 10 }}
  page={page}
  onPageChange={(p, l) => { setPage(p); setLimit(l); }}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
/>
```

---

## 🛠️ TableToolbar

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | TanStack Table | required | Table instance |
| `columns` | `ColumnDef[]` | `[]` | Original column defs for export |
| `fileName` | `string` | `"data"` | PDF export filename |
| `search` | `string` | — | Current search value |
| `onSearchChange` | `(val) => void` | — | Search handler |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder text |
| `onRefresh` | `() => void` | — | Refresh handler |
| `loading` | `boolean` | `false` | Disables refresh while loading |
| `filters` | `ReactNode` | — | Filter elements rendered in toolbar |

### Features
- **SearchBar** — Full-text search with debounce
- **PDF Export** — Exports filtered data to PDF (via jsPDF)
- **Refresh Button** — With spinning animation during loading
- **Filter Slot** — Custom filter controls rendered between search and actions

---

## 📋 TableBody

### Features
- **Skeleton Loading** — 8 animated skeleton rows during loading
- **Overflow Tooltips** — Hover tooltip (via portal) when cell text overflows
- **Clickable Rows** — Configurable row click with action button guards
- **Sticky Columns** — Configurable first/last column stickiness
- **Custom Row ClassNames** — Via `rowClassName` prop or function

---

## 🔝 TableHead

### Features
- **Sort Indicators** — Dual-arrow (asc/desc) with active state highlighting
- **Column Resizing** — Drag-to-resize with onChange mode
- **Sticky Headers** — First + last column stickiness
- **Accessible** — Sort toggles via click on header labels

---

## 📄 TablePagination

### Props

| Prop | Type | Description |
|------|------|-------------|
| `pagination` | `{ total, pages, limit }` | Pagination metadata |
| `page` | `number` | Current active page |
| `onPageChange` | `(page, limit) => void` | Page/limit change handler |

### Features
- **First/Previous/Next/Last** navigation buttons
- **Smart Page Numbers** — Shows pages around current, with ellipsis
- **Rows Per Page** — Select: 10, 20, 50, 100
- **Record Info** — "Showing X - Y of Z"
- **Disabled States** — First/Prev disabled on page 1, Next/Last disabled on last page

---

## 🔘 TableActions

### Props (Legacy Mode)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onView` | `() => void` | — | View detail action |
| `onEdit` | `() => void` | — | Edit action |
| `onDelete` | `() => void` | — | Delete action |
| `onTogglePower` | `() => void` | — | Power toggle action |
| `isPowered` | `boolean` | `true` | Current power state |
| `showView` | `boolean` | `true` | Show view button |
| `showEdit` | `boolean` | `true` | Show edit button |
| `showDelete` | `boolean` | `true` | Show delete button |
| `showPower` | `boolean` | `false` | Show power toggle |

### Props (Modern Array Mode)

```jsx
<TableActions
  actions={[
    { label: "Edit", icon: Edit, onClick: handleEdit, variant: "primary" },
    { label: "Delete", icon: Trash2, onClick: handleDelete, variant: "danger", disabled: !canDelete },
  ]}
/>
```

### Action Variants
| Variant | Class | Use Case |
|---------|-------|----------|
| `primary` | `dt-action-primary` | Primary action (blue) |
| `view` | `dt-action-view` | View details (default blue) |
| `danger` | `dt-action-danger` | Destructive actions (red) |
| `warning` | `dt-action-warning` | Warning actions (amber) |
| `success` | `dt-action-success` | Confirm actions (green) |
| `info` | `dt-action-info` | Info actions (indigo) |

---

## 🧩 Table Cells

Pre-built cell renderers for common data types:

| Cell | Description |
|------|-------------|
| `StatusCell` | Inline status dropdown selector |
| `CurrencyCell` | Formatted currency ($1.2K, $3.5M) |
| `AvatarCell` | Avatar + name/subtitle composite |
| `DateCell` | Date formatting (short, long, relative) |
| `CopyableCell` | Click-to-copy text with feedback |
| `ActionsCell` | Wrapper for TableActions |

### CurrencyCell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Numeric value |
| `prefix` | `string` | `"$"` | Currency symbol |
| `compact` | `boolean` | `false` | Compact notation (1.2K, 3.5M) |
| `decimals` | `number` | `1` | Decimal places |
| `divisor` | `number` | `1` | Divide value (e.g., 100 for cents→dollars) |
| `unit` | `string` | `""` | Unit suffix |

### DateCell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| Date` | required | Date value |
| `format` | `"short" \| "long" \| "numeric" \| "relative"` | `"short"` | Format type |
| `locale` | `string` | `"en-IN"` | Locale string |
| `fallback` | `string` | `"—"` | Fallback for invalid dates |

### AvatarCell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Display name + initials |
| `image` | `string` | — | Avatar image URL |
| `subtitle` | `string` | — | Secondary text |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Avatar size |
| `rounded` | `"sm" \| "md" \| "lg" \| "full"` | `"lg"` | Border radius |

---

## 🎨 Styling

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.dt-root` | Root container |
| `.dt-container` | Scrollable table wrapper |
| `.dt-wrapper` | Inner overflow wrapper |
| `.dt-table` | `<table>` element |
| `.dt-th` | Header cell |
| `.dt-th--sticky-left/right` | Sticky header variants |
| `.dt-th--sortable` | Sortable header |
| `.dt-td` | Data cell |
| `.dt-td--sticky-left/right` | Sticky cell variants |
| `.dt-td--left/center/right` | Text alignment |
| `.dt-row` | Table row |
| `.dt-row--clickable` | Clickable row with cursor |
| `.dt-pagination` | Pagination bar |
| `.dt-actions` | Action buttons container |

### Customization Points

```css
/* Override table tokens */
:root {
  --dt-border: var(--border-color);
  --dt-sticky-shadow: 2px 0 8px rgba(0,0,0,0.06);
  --dt-sort-color: var(--primary);
  --dt-skeleton-bg: var(--surface-tertiary);
}
```

---

## 📊 DataTable Stats

| Feature | Lines | Tech |
|---------|-------|------|
| DataTable (root) | ~150 | TanStack React Table v8 |
| TableHead | ~70 | flexRender, sorting |
| TableBody | ~130 | Portal tooltips, skeletons |
| TablePagination | ~100 | Page nav with ellipsis |
| TableToolbar | ~80 | Search + PDF export |
| TableActions | ~120 | Legacy + modern modes |
| **Total** | **~650** | |

---

## 🧪 Generated Template

When Prism generates a feature with DataTable, the output will be:

```jsx
// src/features/[feature]/components/[Feature]Table.jsx
import { useMemo } from "react";
import DataTable from "@components/common/DataTable";
import { StatusCell, CurrencyCell, AvatarCell, DateCell, ActionsCell } from "@components/common/DataTable/cells";
import { use[Feature]List } from "../hooks/use[Feature]List";

export function [Feature]Table({ onView, onEdit, onDelete }) {
  const { data, isLoading, pagination, page, setPage, search, setSearch, refresh } = use[Feature]List();

  const columns = useMemo(() => [
    { key: "name", label: "Name", render: (val, row) => <AvatarCell name={val} subtitle={row.email} />, width: 250 },
    { key: "amount", label: "Amount", align: "right", render: (val) => <CurrencyCell value={val} compact />, width: 150 },
    { key: "date", label: "Date", render: (val) => <DateCell value={val} format="relative" />, width: 120 },
    { key: "status", label: "Status", width: 130 },
    { key: "actions", label: "", width: 100, sortable: false,
      render: (_, row) => <ActionsCell onView={() => onView(row.id)} onEdit={() => onEdit(row.id)} onDelete={() => onDelete(row.id)} /> },
  ], []);

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      showToolbar
      storageKey="[feature]-table"
      title="All [Features]"
      search={search}
      onSearchChange={setSearch}
      onRefresh={refresh}
      pagination={pagination}
      page={page}
      onPageChange={setPage}
      onRowClick={(row) => onView(row.id)}
    />
  );
}
```

---

## ✅ Checklist — When to Use

| Scenario | Recommendation |
|----------|---------------|
| List of records with sorting | ✅ DataTable |
| Inline status editing | ✅ DataTable + StatusCell |
| Read-only data display | ✅ DataTable with onRowClick |
| Mobile-first table | ⚠️ EntityCard + ViewToggle preferred |
| < 10 items, no interaction | ❌ Simple list or Cards |
