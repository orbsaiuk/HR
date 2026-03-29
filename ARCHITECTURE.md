# Form Builder App - Architecture Overview

## 🏛️ Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                                                              │
│  app/                                                        │
│  └── (dashboard)/                                           │
│      └── company/                                         │
│          ├── page.jsx (5 lines - orchestration only)       │
│          └── forms/                                         │
│              └── page.jsx (5 lines - orchestration only)   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓ uses
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│                                                              │
│  features/                                                   │
│  ├── company/                                             │
│  │   ├── ui/                                                │
│  │   │   ├── DashboardPage.jsx (45 lines)                  │
│  │   │   ├── StatsCards.jsx                                │
│  │   │   ├── QuickActions.jsx                              │
│  │   │   └── RecentActivity.jsx                            │
│  │   ├── model/                                             │
│  │   │   └── useDashboardStats.js (custom hook)            │
│  │   └── index.js (public API)                             │
│  │                                                           │
│  └── forms/                                                  │
│      ├── ui/                                                 │
│      │   ├── FormsListPage.jsx (80 lines)                  │
│      │   ├── FormsFilters.jsx                              │
│      │   ├── FormsTable.jsx                                │
│      │   └── FormCard.jsx                                  │
│      ├── model/                                             │
│      │   ├── useFormsList.js                               │
│      │   ├── useFormFilters.js                             │
│      │   └── useFormActions.js                             │
│      └── index.js (public API)                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓ uses
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│                                                              │
│  features/                                                   │
│  ├── company/                                             │
│  │   └── lib/                                               │
│  │       └── dateUtils.js (business logic)                 │
│  │                                                           │
│  └── forms/                                                  │
│      └── types/                                              │
│          └── form.types.js (domain models)                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓ uses
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│                                                              │
│  features/                                                   │
│  ├── company/                                             │
│  │   └── api/                                               │
│  │       └── dashboardApi.js (API calls)                   │
│  │                                                           │
│  └── forms/                                                  │
│      └── api/                                                │
│          └── formsApi.js (API calls)                        │
│                                                              │
│  shared/                                                     │
│  └── api/                                                    │
│      ├── client.js (HTTP client)                           │
│      └── endpoints.js (API routes)                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Example: Dashboard Page Load

```
1. User visits /dashboard
   ↓
2. app/(dashboard)/company/page.jsx
   - Imports DashboardPage from feature
   - Renders: <DashboardPage />
   ↓
3. features/company/ui/DashboardPage.jsx
   - Calls: useDashboardStats()
   - Renders: <StatsCards />, <QuickActions />, etc.
   ↓
4. features/company/model/useDashboardStats.js
   - Calls: dashboardApi.getStats()
   - Manages: loading, error, data states
   ↓
5. features/company/api/dashboardApi.js
   - Calls: apiClient.get(API_ENDPOINTS.FORMS)
   - Transforms: raw data → stats
   ↓
6. shared/api/client.js
   - Makes: HTTP request
   - Handles: errors, response parsing
   ↓
7. API Response
   - Returns: data to hook
   - Hook updates: component state
   - Component: re-renders with data
```

## 📦 Feature Structure (FSD)

### Dashboard Feature

```
features/company/
│
├── api/                    # Infrastructure Layer
│   └── dashboardApi.js     # External API calls
│       - getStats()
│
├── model/                  # Application Layer
│   └── useDashboardStats.js # Business logic hook
│       - Manages state
│       - Handles loading/error
│       - Calls API
│
├── ui/                     # Presentation Layer
│   ├── DashboardPage.jsx   # Main orchestrator (45 lines)
│   ├── StatsCards.jsx      # Stats display component
│   ├── QuickActions.jsx    # Action cards component
│   ├── RecentActivity.jsx  # Activity list component
│   └── GettingStarted.jsx  # Onboarding component
│
├── lib/                    # Domain Layer
│   └── dateUtils.js        # Utility functions
│       - formatRelativeDate()
│
└── index.js                # Public API
    - Exports only what other features need
```

### Forms Feature

```
features/forms/
│
├── api/                    # Infrastructure Layer
│   └── formsApi.js         # CRUD operations
│       - getAll()
│       - create()
│       - update()
│       - delete()
│       - publish()
│       - close()
│
├── model/                  # Application Layer
│   ├── useFormsList.js     # List state management
│   ├── useFormFilters.js   # Filtering & sorting logic
│   └── useFormActions.js   # Action handlers
│
├── ui/                     # Presentation Layer
│   ├── FormsListPage.jsx   # Main orchestrator (80 lines)
│   ├── FormsFilters.jsx    # Filter controls
│   ├── FormsTable.jsx      # Table wrapper
│   ├── FormCard.jsx        # Table row
│   ├── FormActionsMenu.jsx # Actions dropdown
│   └── FormStatusBadge.jsx # Status badge
│
├── types/                  # Domain Layer
│   └── form.types.js       # Type definitions
│
└── index.js                # Public API
```

## 🔗 Dependencies

### Dependency Rules

```
✅ Allowed:
- Presentation → Application
- Application → Domain
- Application → Infrastructure
- Domain → (nothing)
- Infrastructure → (external services)

❌ Not Allowed:
- Domain → Application
- Domain → Infrastructure
- Infrastructure → Application
- Infrastructure → Domain
```

### Import Examples

```javascript
// ✅ Good: Page imports from feature
import { DashboardPage } from "@/features/dashboard";

// ✅ Good: Component uses hook
import { useDashboardStats } from "../model/useDashboardStats";

// ✅ Good: Hook uses API
import { dashboardApi } from "../api/dashboardApi";

// ✅ Good: API uses shared client
import { apiClient } from "@/shared/api/client";

// ❌ Bad: Page directly calls API
import { dashboardApi } from "@/features/company/api/dashboardApi";

// ❌ Bad: Component directly calls API
const data = await fetch("/api/forms");
```

## 🎯 Component Hierarchy

### Dashboard Page

```
DashboardPage (45 lines)
├── Header (inline)
├── StatsCards (50 lines)
│   └── StatCard × 4
├── QuickActions (35 lines)
│   ├── CreateFormCard
│   └── ViewFormsCard
├── RecentActivity (70 lines)
│   └── ActivityItem × N
└── GettingStarted (40 lines)
    └── ActionButtons
```

### Forms List Page

```
FormsListPage (80 lines)
├── Header (inline)
├── FormsFilters (60 lines)
│   ├── SearchInput
│   ├── StatusFilter
│   └── SortSelect
├── FormsTable (35 lines)
│   ├── TableHeader
│   └── FormCard × N (50 lines each)
│       ├── FormInfo
│       ├── FormStatusBadge (35 lines)
│       └── FormActionsMenu (90 lines)
└── EmptyState (when no forms)
```

## 🔄 State Management

### Local State (useState)

```javascript
// Component-specific state
const [isOpen, setIsOpen] = useState(false);
```

### Shared State (Custom Hooks)

```javascript
// Feature-level state
const { forms, loading } = useFormsList();
```

### Server State (API + Hooks)

```javascript
// Data from server
const { stats, loading, error, refetch } = useDashboardStats();
```

### Derived State (useMemo)

```javascript
// Computed from other state
const filteredForms = useMemo(() => {
  return forms.filter(/* ... */);
}, [forms, filters]);
```

## 🧩 Composition Patterns

### Container/Presenter

```javascript
// Container (logic)
function DashboardPage() {
  const { stats, loading } = useDashboardStats();
  return <StatsCards stats={stats} />;
}

// Presenter (UI)
function StatsCards({ stats }) {
  return <div>{/* render */}</div>;
}
```

### Compound Components

```javascript
<FormsTable>
  <FormsTable.Header />
  <FormsTable.Body>
    {forms.map((form) => (
      <FormCard key={form.id} form={form} />
    ))}
  </FormsTable.Body>
</FormsTable>
```

### Render Props

```javascript
<DataFetcher
  fetch={dashboardApi.getStats}
  render={({ data, loading }) =>
    loading ? <Loading /> : <StatsCards stats={data} />
  }
/>
```

## 📊 Performance Optimization

### Memoization

```javascript
// Expensive calculations
const filteredForms = useMemo(() => {
  return forms.filter(/* ... */);
}, [forms, filters]);

// Prevent re-renders
const MemoizedCard = memo(FormCard);
```

### Code Splitting

```javascript
// Lazy load features
const DashboardPage = lazy(() => import("@/features/dashboard"));
```

### Optimistic Updates

```javascript
// Update UI immediately
setForms(forms.filter((f) => f.id !== deletedId));
// Then sync with server
await formsApi.delete(deletedId);
```

## 🧪 Testing Strategy

### Unit Tests

```javascript
// Test hooks
test("useDashboardStats fetches data", async () => {
  const { result } = renderHook(() => useDashboardStats());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.stats).toBeDefined();
});

// Test components
test("StatsCards renders stats", () => {
  render(<StatsCards stats={mockStats} />);
  expect(screen.getByText("10")).toBeInTheDocument();
});
```

### Integration Tests

```javascript
// Test feature flow
test("dashboard loads and displays stats", async () => {
  render(<DashboardPage />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText("Total Forms")).toBeInTheDocument();
  });
});
```

## 🎨 Styling Approach

### Tailwind CSS (Current)

```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {/* content */}
</div>
```

### Component Variants

```javascript
const variants = {
  primary: "bg-blue-600 text-white",
  secondary: "bg-gray-200 text-gray-800",
};
```

## 📝 Naming Conventions

### Files

- Components: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- Utils: `camelCase.js`
- Types: `camelCase.types.js`

### Functions

- Components: `PascalCase`
- Hooks: `useCamelCase`
- Utils: `camelCase`
- Handlers: `handleCamelCase`

### Variables

- State: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Props: `camelCase`

---

**This architecture ensures:**

- ✅ Separation of concerns
- ✅ Testability
- ✅ Maintainability
- ✅ Scalability
- ✅ Reusability
- ✅ Performance
