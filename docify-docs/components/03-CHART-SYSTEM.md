# Prism — Chart System

> **8 pre-built chart types** — powered by Recharts — with premium tooltip styling, interactive legends, and dark mode support.

## 📦 Components Included

| Component | Description |
|-----------|-------------|
| **AreaChart** | Gradient-filled area chart with multiple series |
| **BarChart** | Premium bar chart with interactive legend |
| **DonutChart** | Donut/pie chart with center label & legend |
| **LineChart** | Smooth line chart with dots |
| **GaugeChart** | SVG semi-circular gauge with animated needle |
| **RadarChart** | Polar radar chart for performance metrics |
| **RadialWedgeChart** | Custom radial wedge chart (no deps) |
| **TelemetryAreaChart** | Glowing telemetry-style area chart |

---

## 📈 AreaChart (`NXAreaChart`)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object[]` | required | Chart data array |
| `xKey` | `string` | `"name"` | X-axis data key |
| `series` | `{ key, label, color?, strokeWidth?, dashed?, fill? }[]` | `[]` | Series configurations |
| `height` | `number` | `300` | Chart height in px |
| `tooltipConfig` | `{ contentStyle?, itemStyle? }` | `{}` | Tooltip style overrides |

### Usage

```jsx
<AreaChart
  data={[
    { month: "Jan", revenue: 40000, costs: 24000 },
    { month: "Feb", revenue: 30000, costs: 18000 },
    { month: "Mar", revenue: 50000, costs: 32000 },
  ]}
  xKey="month"
  series={[
    { key: "revenue", label: "Revenue", color: "var(--primary)", strokeWidth: 4 },
    { key: "costs", label: "Costs", color: "var(--warning)", strokeWidth: 3, dashed: true },
  ]}
  height={320}
/>
```

### Features
- Gradient fill per series (5% → 0% opacity)
- Monotone interpolation for smooth curves
- Active dot on hover (r=6)
- Dashed series support
- Grid: horizontal only, light stroke

---

## 📊 BarChart

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object[]` | `[]` | Chart data |
| `xKey` | `string` | `"name"` | X-axis key |
| `series` | `{ key, label, color?, radius?, barSize?, perItemColor? }[]` | `[]` | Series config |
| `height` | `number` | `300` | Chart height |
| `colors` | `string[]` | palette | Color array |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showLegend` | `boolean` | `true` | Show legend |
| `interactiveLegend` | `boolean` | `false` | Click legend to toggle series |
| `margin` | `object` | — | Chart margin override |
| `tooltipFormatter` | `fn` | — | Custom tooltip formatter |
| `barGap` | `number` | `4` | Gap between bars |
| `barCategoryGap` | `string` | `"20%"` | Category gap |
| `stacked` | `boolean` | `false` | Stacked bar mode |

### Features
- **Interactive Legend** — Click to toggle series visibility (with strikethrough)
- **Custom Tooltip** — Glassmorphic style with colored dots
- **Per-Item Colors** — `series.perItemColor` function for individual bar colors
- **Empty State** — "No Metrics Selected" when all series hidden
- **Rounded Corners** — Configurable bar radius

---

## 🍩 DonutChart

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `{ name, value, color }[]` | `[]` | Data with colors |
| `innerRadius` | `number` | `60` | Inner radius (0 = pie) |
| `outerRadius` | `number` | `80` | Outer radius |
| `centerLabel` | `string` | — | Label inside donut |
| `centerValue` | `string \| number` | — | Value inside donut |
| `height` | `number` | `200` | Chart height |
| `showLegend` | `boolean` | `true` | Horizontal legend row |

### Features
- **Center Content** — Custom label + value inside donut
- **Pie Mode** — Set innerRadius=0 for pie chart
- **Horizontal Legend** — Colored dots + name + value + percentage
- **Hover Glow** — Drop-shadow on segments
- **Smooth Animation** — 800ms duration

---

## 📉 LineChart (`NXLineChart`)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object[]` | required | Chart data |
| `xKey` | `string` | `"name"` | X-axis key |
| `series` | `{ key, label, color?, strokeWidth?, dashed? }[]` | `[]` | Series config |
| `height` | `number` | `300` | Chart height |
| `tooltipConfig` | `object` | `{}` | Tooltip overrides |

### Usage

```jsx
<LineChart
  data={performanceData}
  xKey="date"
  series={[
    { key: "cpu", label: "CPU Usage", color: "var(--primary)" },
    { key: "memory", label: "Memory", color: "var(--success)" },
    { key: "disk", label: "Disk I/O", color: "var(--warning)", dashed: true },
  ]}
/>
```

---

## 🎯 GaugeChart

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current value |
| `max` | `number` | `100` | Maximum value |
| `size` | `number` | `240` | SVG size |
| `strokeWidth` | `number` | `24` | Arc thickness |
| `showLegend` | `boolean` | `true` | Show Low/Med/High indicators |
| `needleType` | `"stick" \| "line"` | `"stick"` | Needle style |
| `colors` | `{ lowColor, midColor, highColor }` | — | Custom color scheme |

### Features
- **Animated Needle** — Spring animation on mount (1.2s)
- **3-Zone Coloring** — Red (0-32%) → Amber (33-66%) → Green (67-100%)
- **Dashed Arc** — Mid-line cut overlay for precision look
- **Center Pivot** — Multi-layered mechanical dial
- **Indicator Cards** — 3 card footer with zone colors & ranges
- **SVG Gradient** — Smooth color transition along the arc

---

## 🕸️ RadarChart

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `{ name, value }[]` | required | Radar data |
| `dataKey` | `string` | `"value"` | Value key |
| `nameKey` | `string` | `"name"` | Name key |
| `height` | `number` | `240` | Chart height |
| `color` | `string` | `"var(--primary)"` | Chart color |

### Usage

```jsx
<RadarChart
  data={[
    { name: "Speed", value: 85 },
    { name: "Quality", value: 92 },
    { name: "Cost", value: 70 },
    { name: "Time", value: 88 },
    { name: "Scope", value: 75 },
  ]}
  color="var(--success)"
  height={280}
/>
```

---

## 🌊 TelemetryAreaChart

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object[]` | required | Time-series data |
| `xKey` | `string` | `"name"` | X-axis key |
| `yKey` | `string` | `"value"` | Y-axis key |
| `color` | `string` | `"var(--primary)"` | Line color |
| `height` | `number` | `180` | Chart height |
| `glowColor` | `string` | `"rgba(244,63,94,0.4)"` | Glow effect color |
| `gradientStops` | `{ offset, opacity }[]` | — | Gradient stops |

### Features
- **CRT Glow Filter** — SVG feGaussianBlur glow on stroke
- **Dark Glassmorphic Tooltip** — Semi-transparent dark tooltip
- **Compact Height** — Ideal for dashboard bento cards
- **Pulsing Area** — Gradient fill from colored to transparent
- **Active Dot** — Glowing dot on hover

---

## 🔄 RadialWedgeChart

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `{ period, value }[]` | `[]` | Radial data |
| `size` | `number` | `180` | SVG size |
| `maxVal` | `number` | — | Max value (auto-calculated) |
| `color` | `string` | `"#93c5fd"` | Wedge color |
| `className` | `string` | — | Additional classes |

### Features
- **Zero Dependencies** — Pure SVG + Framer Motion (no Recharts)
- **Animated Wedges** — Spring-staggered entry (scale + pathLength)
- **Hover Tooltip** — Floating center display on wedge hover
- **Concentric Rings** — 16 dashed grid rings for depth
- **Radial Labels** — Auto-positioned text around the perimeter
- **Glow Effect** — feGaussianBlur on hovered wedge

---

## 🎨 Chart Theme Configuration

```javascript
// src/shared/lib/chart-theme.js
export const chartConfig = {
  grid: {
    strokeDasharray: "3 3",
    stroke: "var(--border-base)",
    strokeOpacity: 0.5,
  },
  axis: {
    axisLine: false,
    tickLine: false,
    tick: {
      fill: "var(--text-muted)",
      fontSize: 10,
      fontWeight: 700,
      fontFamily: "var(--font-sans)",
    },
  },
  tooltip: {
    contentStyle: {
      background: "var(--bg-surface)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      fontSize: "11px",
      padding: "10px 14px",
    },
    itemStyle: {
      fontSize: "11px",
      fontWeight: 700,
      color: "var(--text-primary)",
    },
  },
};
```

---

## 📊 Chart System Stats

| Component | Lines | Dependencies | Premium Features |
|-----------|-------|-------------|-----------------|
| AreaChart | ~65 | Recharts | Gradient fill, dashed series |
| BarChart | ~190 | Recharts | Interactive legend, per-item colors |
| DonutChart | ~100 | Recharts | Center label, percentage legend |
| LineChart | ~55 | Recharts | Monotone interpolation |
| GaugeChart | ~250 | Framer Motion | Animated needle, 3-zone colors |
| RadarChart | ~45 | Recharts | Polar grid |
| TelemetryAreaChart | ~100 | Recharts | Glow filter, glass tooltip |
| RadialWedgeChart | ~250 | Framer Motion | Zero deps chart, spring animation |
| **Total** | **~1,055** | | |
