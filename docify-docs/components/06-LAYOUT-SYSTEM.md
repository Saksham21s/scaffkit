# Prism — Layout System

> **Complete application layout system** — responsive sidebar, header with search/notifications/profile, auth layout, and dashboard shell.

## 📦 Components Included

| Component | Description |
|-----------|-------------|
| **DashboardLayout** | Main app shell — Sidebar + Header + Outlet |
| **Sidebar** | Collapsible navigation with nested groups, icons, active states |
| **Header** | Top bar — breadcrumbs, search, notifications, profile |
| **AuthLayout** | Centered auth pages layout |

---

## 🏛️ DashboardLayout

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `<Outlet />` | Main content |
| `defaultSidebarCollapsed` | `boolean` | `false` | Initial sidebar state |

### Structure

```jsx
<DashboardLayout>
  <Sidebar collapsed={sidebarCollapsed} onToggle={toggle} />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Header onMenuClick={toggle} />
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />   {/* or children */}
    </main>
  </div>
</DashboardLayout>
```

### Features
- **Responsive** — Sidebar auto-collapses on mobile
- **Smooth Transitions** — All layout transitions 200ms ease
- **Scrollable Content** — Main area independently scrollable
- **Full Viewport** — `h-screen` with overflow management

### Route Integration

```jsx
// router.jsx
<Route element={<DashboardLayout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="users" element={<Users />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

---

## 📂 Sidebar

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collapsed` | `boolean` | `false` | Collapsed state |
| `onToggle` | `() => void` | — | Toggle handler |
| `items` | `SidebarItem[]` | auto | Navigation items |
| `logo` | `ReactNode` | — | Custom logo |
| `footer` | `ReactNode` | — | Custom footer |
| `className` | `string` | — | Additional classes |

### Navigation Items Structure

```typescript
interface SidebarItem {
  key: string;
  label: string;
  icon: React.ComponentType;
  path?: string;
  badge?: number | string;
  children?: SidebarItem[];  // Nested items
  isActive?: boolean;
  onClick?: () => void;
}
```

### Sub-components

| Sub-component | Purpose |
|---------------|---------|
| `Sidebar.Group` | Nested navigation group with expand/collapse |
| `Sidebar.Link` | Individual navigation link with icon + active state |
| `Sidebar.Footer` | Bottom section (user info, logout) |

### Features
- **Collapsible** — Smooth width transition (240px ↔ 64px)
- **Nested Groups** — Expandable/collapsible with chevron indicator
- **Active Detection** — Auto-highlights based on route pathname
- **Icons** — Consistent 20px icons with active glow
- **Badges** — Notification count badges on links
- **Tooltips** — Show labels on hover when collapsed
- **Keyboard Nav** — Arrow keys within groups

### Usage

```jsx
<Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
  <Sidebar.Link to="/dashboard" icon={LayoutDashboard}>Dashboard</Sidebar.Link>
  <Sidebar.Link to="/users" icon={Users} badge={12}>Users</Sidebar.Link>
  <Sidebar.Group icon={FolderKanban} label="Projects">
    <Sidebar.Link to="/projects/active">Active</Sidebar.Link>
    <Sidebar.Link to="/projects/archived">Archived</Sidebar.Link>
  </Sidebar.Group>
  <Sidebar.Footer>
    <Sidebar.Link to="/settings" icon={Settings}>Settings</Sidebar.Link>
  </Sidebar.Footer>
</Sidebar>
```

---

## 🧭 Header

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page title (breadcrumb last) |
| `onMenuClick` | `() => void` | — | Mobile menu toggle |
| `search` | `{ value, onChange, placeholder }` | — | Search config |
| `notifications` | `{ items, onViewAll, unreadCount }` | — | Notification dropdown |
| `profile` | `{ name, avatar, menu }` | — | Profile dropdown |
| `actions` | `ReactNode` | — | Additional header actions |
| `breadcrumbs` | `{ label, path }[]` | — | Breadcrumb trail |

### Features
- **Breadcrumbs** — Auto-generated from route or manual
- **Global Search** — Keyboard shortcut (Cmd+K) to focus
- **Notification Bell** — Unread count badge + dropdown drawer
- **Profile Menu** — Avatar + dropdown with menu items
- **Responsive** — Menu button appears on mobile
- **Sticky** — Fixed top with backdrop blur

### Usage

```jsx
<Header
  title="User Management"
  onMenuClick={toggleSidebar}
  breadcrumbs={[
    { label: "Home", path: "/" },
    { label: "Users", path: "/users" },
  ]}
  search={{
    value: searchTerm,
    onChange: setSearchTerm,
    placeholder: "Search users...",
  }}
  notifications={{
    items: notifications,
    onViewAll: () => navigate("/notifications"),
    unreadCount: 5,
  }}
  profile={{
    name: "Rahul Sharma",
    avatar: "/path/to/avatar.jpg",
    menu: [
      { label: "Profile", onClick: () => navigate("/profile") },
      { label: "Settings", onClick: () => navigate("/settings") },
      { type: "divider" },
      { label: "Logout", onClick: logout, variant: "danger" },
    ],
  }}
/>
```

---

## 🔐 AuthLayout

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page title |
| `subtitle` | `string` | — | Page subtitle |
| `children` | `ReactNode` | required | Form content |
| `logo` | `ReactNode` | — | Logo/branding |
| `footer` | `ReactNode` | — | Footer content (links) |

### Features
- **Centered Card** — Vertically + horizontally centered
- **Light Mode Only** — Forces light theme on auth pages
- **Background** — Subtle gradient or pattern
- **Responsive** — Full width on mobile, card on desktop
- **Branding Slot** — Logo + app name header

### Usage

```jsx
<AuthLayout
  title="Welcome Back"
  subtitle="Sign in to your account to continue"
  logo={<AppLogo />}
  footer={
    <p>
      Don't have an account? <Link to="/signup">Sign up</Link>
    </p>
  }
>
  <LoginForm onSubmit={handleLogin} />
</AuthLayout>
```

---

## 🎨 Styling Tokens — Layout

```css
/* Layout-specific tokens */
:root {
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --header-height: 64px;
  --sidebar-bg: #0f172a;        /* Dark sidebar */
  --sidebar-text: #94a3b8;
  --sidebar-active: var(--primary);
  --sidebar-hover: rgba(255,255,255,0.06);
  --header-bg: rgba(255,255,255,0.8);
  --header-border: var(--border-color);
  --auth-max-width: 420px;
  --layout-transition: 200ms ease;
}
```

---

## 📊 Layout System Stats

| Component | Lines | Sub-components | Dependencies |
|-----------|-------|---------------|-------------|
| DashboardLayout | ~60 | — | react-router-dom |
| Sidebar | ~200 | SidebarGroup, SidebarLink, SidebarFooter | react-router-dom, lucide-react |
| Header | ~150 | SearchBar, NotificationDrawer, Avatar | lucide-react |
| AuthLayout | ~60 | — | — |
| **Total** | **~470** | | |
