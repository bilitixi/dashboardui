# UPS Dashboard — Integration Specs

> **Purpose**: This document describes everything needed to embed the UPS dashboard into a larger React project. It covers the component API, data dependencies, backend contract, styling tokens, and step-by-step integration instructions.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Environment Variables](#3-environment-variables)
4. [Entry Point Component](#4-entry-point-component)
5. [Component Reference](#5-component-reference)
6. [Data Layer](#6-data-layer)
   - [TypeScript Types](#61-typescript-types)
   - [API Client Functions](#62-api-client-functions)
   - [React Query Hooks](#63-react-query-hooks)
7. [Backend API Contract](#7-backend-api-contract)
8. [Mock Data Fallback](#8-mock-data-fallback)
9. [Styling & Design Tokens](#9-styling--design-tokens)
10. [Integration Guide](#10-integration-guide)

---

## 1. Overview

A dark-themed monitoring dashboard for APC UPS infrastructure data. It reads from a FastAPI backend that syncs from the EcoStruxure IT API into Supabase PostgreSQL. The dashboard is self-contained — it manages its own data fetching, caching, and state. The host project only needs to mount the `<Dashboard />` page component and supply `REACT_APP_API_URL`.

**Key panels:**
- Summary KPI cards (devices, active alarms, critical alarms, warnings)
- Alarms by severity chart (stacked bar, 24h / 7-day window)
- Power & sensor metrics panel (per-sensor min/avg/max bars)
- Alarms table with severity/status filtering
- Units (devices) table with location filter and search
- Sync status panel with per-org incremental sync trigger

---

## 2. Tech Stack & Dependencies

### Runtime dependencies (must be present in the host project)

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.7 | Core |
| `react-dom` | ^19.2.7 | Core |
| `@tanstack/react-query` | ^5.101.0 | Data fetching / caching |
| `axios` | ^1.17.0 | HTTP client |
| `recharts` | ^3.8.1 | Bar chart (Alarms by severity) |
| `lucide-react` | ^1.17.0 | Icons |
| `date-fns` | ^3.6.0 | Date utilities (used in mock data) |

### Build / styling dependencies

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^3.4.19 | Utility CSS (v3, NOT v4) |
| `autoprefixer` | ^10.5.0 | PostCSS autoprefixer |
| `postcss` | ^8.5.15 | PostCSS (required by Tailwind v3 with CRA) |
| `typescript` | ^4.9.5 | Type checking |

### Required config files (if using Create React App)

**`postcss.config.js`** — must exist at project root:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

**`tailwind.config.js`** — must include `src/**` in content paths:
```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

**`src/index.css`** — must include Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Google Font (Plus Jakarta Sans)

Add to `public/index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 3. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | No | Base URL of the FastAPI backend (e.g. `http://localhost:8000`). If absent, the app falls back to built-in mock data automatically. |

Set in `.env` (CRA convention):
```bash
REACT_APP_API_URL=http://localhost:8000
```

> **Mock mode**: When `REACT_APP_API_URL` is not set, all API calls are replaced with local mock data. No backend is needed for development or UI previews.

---

## 4. Entry Point Component

### `<Dashboard />`

**File**: `src/pages/Dashboard.tsx`
**Export**: default export

**No props required.** The component is fully self-contained — it fetches organizations, auto-selects the first one, and manages all internal state.

```tsx
import Dashboard from './pages/Dashboard';

// Mount directly — no props needed
<Dashboard />
```

**Internal state:**
- `selectedOrgId: string` — auto-set to `orgs[0].id` on first load; user can change via TopNav dropdown
- `searchQuery: string` — propagated to the UnitsTable for device search

**Loading states handled internally:**
- Full-page spinner while organizations load
- Empty state with bootstrap instructions if no organizations exist

---

## 5. Component Reference

All components accept an `orgId: string` prop (the currently selected organization ID). They handle their own data fetching, loading skeletons, and empty states.

### `<TopNav />`

**File**: `src/components/Layout/TopNav.tsx`

```ts
interface TopNavProps {
  selectedOrgId: string;
  onOrgChange: (orgId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}
```

Features: brand display, search input, live clock, bootstrap trigger button ("Request a service or quote"), org selector dropdown (shows org `id` in monospace, label as subtitle), active alarm count badge on bell icon, dark/light toggle (visual only), user avatar.

---

### `<SummaryCards />`

**File**: `src/components/Dashboard/SummaryCards.tsx`

```ts
interface Props { orgId: string; }
```

Renders 4 KPI cards in a 2×2 / 4-column grid:
1. **Total Devices** — from `DeviceHealthReport.total_devices`
2. **Active Alarms** — from `DeviceHealthReport.active_alarms`; card background turns red when > 0
3. **Critical Alarms** — `AlarmsSummaryReport` summary entry for `CRITICAL`, active count
4. **Warnings** — `AlarmsSummaryReport` summary entry for `WARNING`, active count

---

### `<AlarmsSummaryChart />`

**File**: `src/components/Dashboard/BatteryHealthChart.tsx`  
**Export name**: `AlarmsSummaryChart`

```ts
interface Props { orgId: string; }
```

Stacked bar chart (recharts `BarChart`) with:
- X-axis: severity levels (CRITICAL, WARNING, INFO, OK)
- Y-axis: alarm count
- Two stacked bars: **Active** (per-severity color) and **Cleared** (blue `#5b9dff`)
- Time window selector: "Last 24 hours" (default, 24h) / "Last 7 days" (168h)
- Summary pills below chart: per-severity pill showing active count (red) / cleared count (blue) / total
- Legend for Active / Cleared

---

### `<PowerUsagePanel />`

**File**: `src/components/Dashboard/FleetLoadPanel.tsx`  
**Export name**: `PowerUsagePanel`

```ts
interface Props { orgId: string; }
```

Sensor metrics panel with:
- Unit filter tabs: All / W / kW / V / A / % / °C
- Per-sensor `StatBar` showing: name, unit, avg value, data point count, min–avg–max visual bar
- Sensors with no data (count = 0) collapsed in a `<details>` element at the bottom
- Scrollable sensor list (max-height 360px)

---

### `<AlarmsTable />`

**File**: `src/components/Dashboard/AlarmsTable.tsx`

```ts
interface Props { orgId: string; }
```

Paginated table (8 rows/page) with columns: SEVERITY, LABEL, MESSAGE, ACTIVATED, CLEARED, STATUS, REACTIVATIONS.

Filter tabs: **all** / **active** / **cleared**

Subcomponents:
- `SeverityBadge` — pill with dot; colors: CRITICAL `#f1556a`, WARNING `#f9a52e`, INFO `#5b9dff`, OK `#34d17e`; normalizes severity to uppercase and falls back gracefully for unknown values
- `StatusBadge` — "Active" (red) or "Cleared" (green) based on `cleared_time === null`

---

### `<UnitsTable />`

**File**: `src/components/Dashboard/UnitsTable.tsx`

```ts
interface Props { orgId: string; searchQuery?: string; }
```

Paginated table (10 rows/page) with columns: UNIT, LOCATION, MODEL, MANUFACTURER, SERIAL NO., HOSTNAME, IPv4, FIRMWARE, UPDATED.

Features:
- **Location filter** dropdown — fetches locations via `useLocations(orgId)`, resolves `location_id` → label
- **Search** — filters on: `label`, `hostname`, `serial_number`, `manufacturer`, `model_name`, `ipv4_addresses`
- IPv4 addresses rendered as styled monospace chips
- Export button (UI only, no handler)

---

### `<SyncStatusPanel />`

**File**: `src/components/Dashboard/SyncStatus.tsx`  
**Export name**: `SyncStatusPanel`

```ts
// No props
export function SyncStatusPanel() { ... }
```

Per-organization sync status cards showing: org label, status badge (SUCCESS / FAILED / PENDING), inventory / alarm / sensor offsets, last sync time, last error message (if any), and a "Sync" button that triggers `POST /api/ecostruxure/sync/incremental/{org_id}`.

Auto-refreshes every 30 seconds.

---

## 6. Data Layer

### 6.1 TypeScript Types

**File**: `src/api/types.ts`

```ts
interface Organization {
  id: string;
  label: string;
  address: string | null;
  inventory_object_type: string;
  updated_at: string;
}

interface Location {
  id: string;
  organization_id: string;
  label: string;
  address: string | null;
  parent_id: string | null;
  type: string | null;
  inventory_object_type: string;
  updated_at: string;
}

interface Device {
  id: string;
  organization_id: string;
  location_id: string | null;
  parent_id: string | null;
  label: string;
  inventory_object_type: string;
  model_name: string | null;
  device_note: string | null;
  serial_number: string | null;    // NOT unique — sub-components share serials
  hostname: string | null;
  firmware_version: string | null;
  hardware_version: string | null;
  part_number: string | null;
  manufacturer: string | null;
  ipv4_addresses: string[];
  ipv6_addresses: string[];
  mac_addresses: string[];
  gateway_ids: string[];
  updated_at: string;
}

interface PagedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

interface Alarm {
  id: string;
  device_id: string;
  label: string | null;
  message: string | null;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  activated_time: string;
  cleared_time: string | null;
  alarm_reactivation_count: number;
  muted_when_processed: boolean;
  updated_at: string;
}

interface Sensor {
  id: string;
  device_id: string;
  name: string;
  unit: string;
  updated_at: string;
}

interface Measurement {
  id: number;
  sensor_id: string;
  numeric_value: number | null;
  string_value: string | null;
  timestamp: string;
  offset: string | null;
  created_at: string;
}

interface AlarmSeveritySummary {
  severity: string;
  total: number;
  active: number;
}

interface AlarmsSummaryReport {
  organization_id: string;
  timeframe_hours: number;
  summary: AlarmSeveritySummary[];
}

interface DeviceHealthReport {
  organization_id: string;
  total_devices: number;
  active_alarms: number;
}

interface PowerSensorStat {
  sensor_id: string;
  name: string;
  unit: string;
  avg: number | null;    // null when count = 0
  max: number | null;
  min: number | null;
  count: number;
}

interface PowerUsageReport {
  organization_id: string;
  timeframe_hours: number;
  sensors: PowerSensorStat[];
}

interface OrgSyncStatus {
  organization_id: string;
  inventory_offset: number;
  alarm_offset: number;
  sensor_offset: number;
  last_sync_time: string | null;
  last_sync_status: 'SUCCESS' | 'FAILED' | 'PENDING';
  last_error_message: string | null;
}

interface SyncStatusResponse {
  organizations: OrgSyncStatus[];
}
```

---

### 6.2 API Client Functions

**File**: `src/api/client.ts`

All functions check `USE_MOCK = !process.env.REACT_APP_API_URL` and return mock data when true.

```ts
// Organizations
fetchOrganizations(): Promise<Organization[]>

// Locations
fetchLocations(organization_id: string): Promise<Location[]>

// Devices
interface DeviceFilters {
  organization_id: string;
  location_id?: string;
  limit?: number;
  offset?: number;
}
fetchDevices(filters: DeviceFilters): Promise<PagedResponse<Device>>

// Alarms
interface AlarmFilters {
  organization_id: string;
  severity?: 'CRITICAL' | 'WARNING' | 'INFO';
  status?: 'active' | 'cleared';
  limit?: number;
  offset?: number;
}
fetchAlarms(filters: AlarmFilters): Promise<PagedResponse<Alarm>>

// Reports
fetchAlarmsSummary(organization_id: string, timeframe_hours?: number): Promise<AlarmsSummaryReport>
fetchDeviceHealth(organization_id: string): Promise<DeviceHealthReport>

interface PowerUsageFilters {
  organization_id: string;
  timeframe_hours?: number;
  unit?: string;    // 'W' | 'kW' | 'V' | 'A' | '%' | '°C'
}
fetchPowerUsage(filters: PowerUsageFilters): Promise<PowerUsageReport>

// Sync
fetchSyncStatus(): Promise<SyncStatusResponse>
triggerBootstrap(): Promise<{ status: string }>
triggerIncrementalSync(org_id: string): Promise<{ status: string }>
```

---

### 6.3 React Query Hooks

**Files**: `src/hooks/`

All queries require `orgId` to be non-empty (guarded with `enabled: !!orgId`).

| Hook | Stale Time | Refetch Interval | Key |
|---|---|---|---|
| `useOrganizations()` | 60s | — | `['organizations']` |
| `useLocations(orgId)` | 60s | — | `['locations', orgId]` |
| `useDevices(filters)` | 30s | 30s | `['devices', filters]` |
| `useAlarms(filters)` | 15s | 15s | `['alarms', filters]` |
| `useAlarmsSummary(orgId, hours)` | 60s | 60s | `['alarmsSummary', orgId, hours]` |
| `useDeviceHealth(orgId)` | 30s | 30s | `['deviceHealth', orgId]` |
| `usePowerUsage(filters)` | 60s | 60s | `['powerUsage', filters]` |
| `useSyncStatus()` | 30s | 30s | `['syncStatus']` |

**Mutations:**
- `useBootstrap()` — `mutate()` → `POST /api/ecostruxure/sync/bootstrap`; invalidates all queries on success
- `useIncrementalSync()` — `mutate(org_id)` → `POST /api/ecostruxure/sync/incremental/{org_id}`; invalidates `['syncStatus']` on success

---

## 7. Backend API Contract

**Base URL**: `http://localhost:8000` (set via `REACT_APP_API_URL`)

All EcoStruxure endpoints are prefixed with `/api/ecostruxure/`.

### Endpoints used by this dashboard

| Method | Path | Query Params | Response Type |
|---|---|---|---|
| GET | `/api/ecostruxure/organizations` | — | `Organization[]` |
| GET | `/api/ecostruxure/locations` | `organization_id` | `Location[]` |
| GET | `/api/ecostruxure/devices` | `organization_id`, `location_id?`, `limit?`, `offset?` | `PagedResponse<Device>` |
| GET | `/api/ecostruxure/alarms` | `organization_id`, `severity?`, `status?`, `limit?`, `offset?` | `PagedResponse<Alarm>` |
| GET | `/api/ecostruxure/reports/alarms-summary` | `organization_id`, `timeframe_hours?` | `AlarmsSummaryReport` |
| GET | `/api/ecostruxure/reports/device-health` | `organization_id` | `DeviceHealthReport` |
| GET | `/api/ecostruxure/reports/power-usage` | `organization_id`, `timeframe_hours?`, `unit?` | `PowerUsageReport` |
| GET | `/api/ecostruxure/sync/status` | — | `SyncStatusResponse` |
| POST | `/api/ecostruxure/sync/bootstrap` | — | `{ status: string }` |
| POST | `/api/ecostruxure/sync/incremental/{org_id}` | — | `{ status: string }` |

### CORS requirement

The FastAPI backend must allow cross-origin requests from the host project's origin. Either:
- Set `allow_origins=["http://localhost:3000"]` (or the production frontend URL), **and** remove `allow_credentials=True` if cookies are not used; or
- Use `allow_origins=["*"]` without `allow_credentials=True` (browsers reject `*` + credentials together)

---

## 8. Mock Data Fallback

**File**: `src/api/mockData.ts`

When `REACT_APP_API_URL` is not set, the following mock data is returned:

| Export | Content |
|---|---|
| `mockOrganizations` | 3 organizations (`org-1`, `org-2`, `org-3`) |
| `mockLocations` | 4 locations distributed across orgs |
| `mockDevices` | 8 UPS devices with full fields |
| `mockAlarms` | 7 alarms in CRITICAL / WARNING / INFO with mixed active/cleared status |
| `mockAlarmsSummary(orgId)` | Returns `AlarmsSummaryReport` per org |
| `mockDeviceHealth(orgId)` | Returns `DeviceHealthReport` per org |
| `mockPowerUsage(orgId)` | 6 sensor stats; one has `count: 0` with null avg/max/min |
| `mockSyncStatus` | Per-org sync offsets and status |
| `mockDevicesPage(orgId?, locationId?, limit?, offset?)` | Paginated `PagedResponse<Device>` with filtering |

---

## 9. Styling & Design Tokens

### Font

`Plus Jakarta Sans` — weights 400, 500, 600, 700, 800. Loaded via Google Fonts. Falls back to system sans-serif.

Monospace (`IBM Plex Mono` or `ui-monospace`) used for org IDs, IP addresses, serial numbers, and offsets — applied via inline `fontFamily` or Tailwind `font-mono`.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Body / darkest bg | `#0c1b30` | Page background, dropdown backgrounds |
| Nav bg | `#0b1a30` | TopNav background |
| Card bg | `#13263f` | Panel/card backgrounds |
| Hover / alt bg | `#1c3252` | Hover states, chart grid, skeleton loaders |
| Border | `#27425f` | All borders, dividers |
| Text primary | `#eef3fb` | Headings, values, active text |
| Text secondary | `#9fb2cd` | Labels, subtitles |
| Text muted | `#6c7f9c` | Timestamps, counts, placeholders |
| Disabled / faint | `#27425f` | Disabled controls, empty dashes |
| Brand blue | `#4d8df5` | Active selections, buttons, links |
| Info blue | `#5b9dff` | INFO severity, Cleared bar color |
| Critical red | `#f1556a` | CRITICAL severity, Active alarm highlight |
| Warning orange | `#f9a52e` | WARNING severity, accent button |
| OK green | `#34d17e` | OK severity, success states |

### Severity colors (used in charts, badges, pills)

```ts
const SEVERITY_COLORS = {
  CRITICAL: '#f1556a',
  WARNING:  '#f9a52e',
  INFO:     '#5b9dff',
  OK:       '#34d17e',
};
```

### Status colors (Active/Cleared bars in chart)

```ts
const STATUS_COLORS = {
  Active:  '#f1556a',
  Cleared: '#5b9dff',
};
```

### Severity badge backgrounds (darker tints for badge bg)

| Severity | Background | Text | Border |
|---|---|---|---|
| CRITICAL | `#1a0c10` | `#f1556a` | `#f1556a33` |
| WARNING | `#1a1404` | `#f9a52e` | `#f9a52e33` |
| INFO | `#091828` | `#5b9dff` | `#5b9dff33` |
| OK | `#091810` | `#34d17e` | `#34d17e33` |

### Styling approach

All styling is done via **inline `style` props** for colors (no Tailwind color utilities) and **Tailwind utility classes** for layout (flex, grid, spacing, rounding). This avoids Tailwind purging custom hex values.

---

## 10. Integration Guide

### Step 1 — Install dependencies

```bash
npm install @tanstack/react-query axios recharts lucide-react date-fns
npm install -D tailwindcss@3 autoprefixer postcss
```

### Step 2 — Configure Tailwind (if not already set up)

Create `postcss.config.js`:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

Create `tailwind.config.js`:
```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

Add to your `src/index.css` (top of file):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3 — Add Google Font

In `public/index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Step 4 — Wrap your app with QueryClientProvider

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* your routes / shell */}
    </QueryClientProvider>
  );
}
```

> If the host project already uses `@tanstack/react-query`, just use the existing `QueryClientProvider` — no duplication needed.

### Step 5 — Set the API URL

In `.env`:
```bash
REACT_APP_API_URL=http://localhost:8000
```

Leave unset (or omit the file) to use mock data.

### Step 6 — Mount the dashboard

```tsx
import Dashboard from './path/to/dashboard/src/pages/Dashboard';

// Inside a route or component:
<Dashboard />
```

No props required.

### Step 7 — Body background

Set the body background to match the dashboard:
```css
body { background-color: #0c1b30; }
```

Or apply it only to the dashboard route's wrapper div:
```tsx
<div style={{ backgroundColor: '#0c1b30', minHeight: '100vh' }}>
  <Dashboard />
</div>
```

---

## File Structure Reference

```
src/
├── api/
│   ├── types.ts          # All TypeScript interfaces (Organization, Device, Alarm, etc.)
│   ├── client.ts         # Axios-based API functions + mock fallback switch
│   └── mockData.ts       # Mock data arrays and helper functions
├── hooks/
│   ├── useOrganizations.ts
│   ├── useLocations.ts
│   ├── useDevices.ts
│   ├── useAlarms.ts
│   └── useReports.ts     # useAlarmsSummary, useDeviceHealth, usePowerUsage, useSyncStatus, useBootstrap, useIncrementalSync
├── components/
│   ├── Layout/
│   │   └── TopNav.tsx
│   └── Dashboard/
│       ├── SummaryCards.tsx
│       ├── BatteryHealthChart.tsx   # exports AlarmsSummaryChart
│       ├── FleetLoadPanel.tsx       # exports PowerUsagePanel
│       ├── AlarmsTable.tsx
│       ├── UnitsTable.tsx
│       └── SyncStatus.tsx           # exports SyncStatusPanel
├── pages/
│   └── Dashboard.tsx                # default export — mount this
├── index.css
└── index.tsx
```

---

*Generated: June 9, 2026 — dashboardui v0.1.0 on branch `claude/zen-albattani-4IOzo`*
