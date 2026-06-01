# Prism — Feature Generator

## 🎯 Purpose

The Feature Generator is Prism's most powerful module. It creates complete feature modules following the **feature-based architecture** pattern. Each feature is a self-contained module with its own components, hooks, services, pages, and constants.

---

## 📂 Feature Structure Output

```
src/features/[feature-name]/
├── components/
│   ├── [FeatureName]List.jsx       # List view component
│   ├── [FeatureName]Card.jsx       # Card view component
│   ├── [FeatureName]Filter.jsx     # Filter bar component
│   ├── [FeatureName]Form.jsx       # Add/Edit form component
│   ├── [FeatureName]Detail.jsx     # Detail view component
│   ├── [FeatureName]Stats.jsx      # Stats/metrics component
│   └── index.js                    # Barrel exports
├── hooks/
│   ├── use[FeatureName]List.js     # Query: fetch list
│   ├── use[FeatureName]Detail.js   # Query: fetch single
│   ├── use[FeatureName]Mutations   # Mutations: create/update/delete
│   ├── queryKeys.js                # TanStack Query key constants
│   └── index.js
├── pages/
│   ├── [FeatureName]ListPage.jsx   # List page (wraps list components)
│   ├── [FeatureName]DetailPage.jsx # Detail page
│   └── index.js
├── services/
│   └── [featureName]Service.js     # API calls
├── constants/
│   └── index.js                    # Feature-specific constants
├── utils/
│   └── [featureName]Mapper.js      # Data transformers
├── styles/
│   └── [featureName].css           # Feature-specific styles (if custom CSS)
├── components/
│   └── __tests__/                  # Tests (if testing enabled)
├── index.js                        # Feature barrel export
└── README.md                       # Auto-generated feature docs
```

---

## 🧠 Feature Generator Logic

```typescript
// generators/feature-generator.ts
class FeatureGenerator implements Generator {
  name = "Feature Generator";
  priority = 400;

  async validate(config: PrismConfig): Promise<void> {
    if (config.structure.type === "flat") {
      return; // Skip if flat structure chosen
    }
    if (!config.structure.features?.length) {
      throw new PrismError(
        "No features specified",
        ErrorCode.INVALID_CONFIG,
        "Add features to your prism.config.json or pass --features"
      );
    }
  }

  async generate(config: PrismConfig): Promise<GeneratedFile[]> {
    if (config.structure.type === "flat") return [];

    const files: GeneratedFile[] = [];

    for (const featureName of config.structure.features) {
      const pascalName = toPascalCase(featureName);
      const camelName = toCamelCase(featureName);

      // Generate all files for this feature
      files.push(...this.generateFeatureFiles(featureName, pascalName, camelName, config));
    }

    // Generate feature index barrel
    files.push(this.generateFeatureIndex(config));

    return files;
  }

  private generateFeatureFiles(
    feature: string,
    pascal: string,
    camel: string,
    config: PrismConfig
  ): GeneratedFile[] {
    const ext = config.tech.typescript ? "ts" : "js";
    const extx = config.tech.typescript ? "tsx" : "jsx";

    return [
      // Service
      {
        path: `src/features/${feature}/services/${camel}Service.${ext}`,
        content: this.buildService(feature, pascal, camel, config),
      },
      // Query keys
      {
        path: `src/features/${feature}/hooks/queryKeys.${ext}`,
        content: this.buildQueryKeys(feature, camel, config),
      },
      // List hook
      {
        path: `src/features/${feature}/hooks/use${pascal}List.${ext}`,
        content: this.buildListHook(feature, pascal, camel, config),
      },
      // Detail hook
      {
        path: `src/features/${feature}/hooks/use${pascal}Detail.${ext}`,
        content: this.buildDetailHook(feature, pascal, camel, config),
      },
      // Mutations hook
      {
        path: `src/features/${feature}/hooks/use${pascal}Mutations.${ext}`,
        content: this.buildMutationsHook(feature, pascal, camel, config),
      },
      // List page
      {
        path: `src/features/${feature}/pages/${pascal}ListPage.${extx}`,
        content: this.buildListPage(feature, pascal, camel, config),
      },
      // Detail page
      {
        path: `src/features/${feature}/pages/${pascal}DetailPage.${extx}`,
        content: this.buildDetailPage(feature, pascal, camel, config),
      },
      // Constants
      {
        path: `src/features/${feature}/constants/index.${ext}`,
        content: this.buildConstants(feature, pascal, camel, config),
      },
      // Index barrel
      {
        path: `src/features/${feature}/index.${ext}`,
        content: this.buildFeatureIndex(feature, pascal, camel, config),
      },
    ];
  }
}
```

---

## 📝 Generated File Examples

### Service File

```typescript
// src/features/users/services/usersService.ts
import { apiClient } from "@core/api/client";
import { API_ROUTES } from "@core/api/apiRoutes";

export const usersService = {
  /** Fetch paginated list */
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(API_ROUTES.users.list, { params });
    return data;
  },

  /** Fetch single by ID */
  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(API_ROUTES.users.detail(id));
    return data;
  },

  /** Create new */
  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await apiClient.post(API_ROUTES.users.create, payload);
    return data;
  },

  /** Update existing */
  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.put(API_ROUTES.users.update(id), payload);
    return data;
  },

  /** Delete */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.users.delete(id));
  },
};
```

### Hook File (TanStack Query)

```typescript
// src/features/users/hooks/useUsersList.ts
import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services/usersService";
import { usersQueryKeys } from "./queryKeys";

interface UseUsersListOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useUsersList(options: UseUsersListOptions = {}) {
  return useQuery({
    queryKey: usersQueryKeys.list(options),
    queryFn: () => usersService.getAll(options),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,        // 30s before refetch
    gcTime: 5 * 60_000,       // 5min in cache
  });
}
```

### List Page

```typescript
// src/features/users/pages/UsersListPage.tsx
import { useState } from "react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { DataTable } from "@components/common/DataTable";
import { Button } from "@components/ui";
import { Plus } from "lucide-react";
import { useUsersList } from "../hooks/useUsersList";
import { UserFilter } from "../components/UserFilter";
import { USER_COLUMNS } from "../constants";

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsersList({ page, search });

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button variant="primary" icon={Plus}>
          Add User
        </Button>
      </div>

      <UserFilter value={search} onChange={setSearch} />

      <DataTable
        columns={USER_COLUMNS}
        data={data?.items ?? []}
        isLoading={isLoading}
        pagination={{
          current: page,
          total: data?.total ?? 0,
          onChange: setPage,
        }}
      />
    </PageContainer>
  );
}
```

---

## 🔄 Feature Add Command

After project creation, users can add features dynamically:

```bash
$ prism add feature reports
  ✓ Creating reports feature...
  ✓ Generating components...
  ✓ Generating hooks...
  ✓ Generating pages...
  ✓ Generating service...
  ✓ Updating routes...
  ✓ Updating sidebar navigation...

  ✨ Feature "reports" added successfully!
```

### Add Command Logic

```typescript
// cli/commands/add.ts
export async function addCommand(type: string, name: string) {
  const config = await loadProjectConfig();

  if (type === "feature") {
    config.structure.features.push(name);
    const featureGen = new FeatureGenerator();
    const files = await featureGen.generateFeature(name, config);
    await fileWriter.writeAll(process.cwd(), files);

    // Re-generate index and routes
    await regenerateIndex(config);
    await regenerateRoutes(config);

    // Save updated config
    await saveProjectConfig(config);
  }
}
```

---

## 🎨 Feature Templates

### With Custom CSS Styling

```
src/features/users/
├── components/
│   ├── UsersList.jsx
│   └── UserCard.jsx
├── hooks/
│   └── useUsers.js
├── pages/
│   ├── UsersListPage.jsx
│   └── UsersDetailPage.jsx
├── services/
│   └── usersService.js
├── constants/
│   └── index.js
├── styles/
│   └── users.css          # Feature-specific CSS
└── index.js
```

### With Tailwind CSS

```
src/features/users/
├── components/
│   ├── UsersList.jsx       # No separate CSS file needed
│   └── UserCard.jsx
├── hooks/
│   └── useUsers.js
├── pages/
│   ├── UsersListPage.jsx
│   └── UsersDetailPage.jsx
├── services/
│   └── usersService.js
├── constants/
│   └── index.js
└── index.js
```

---

## 📊 Difficulty Analysis

| Aspect | Difficulty | Why |
|--------|-----------|-----|
| **Basic structure gen** | 🟢 Easy | Simple EJS templates |
| **Smart naming** | 🟡 Medium | PascalCase, camelCase, kebab-case conversion |
| **Service generation** | 🟡 Medium | Dynamic API routes, CRUD patterns |
| **Hook generation** | 🔴 Hard | TanStack Query patterns, query keys, mutations |
| **Page generation** | 🟡 Medium | DataTable integration, filter, pagination |
| **Dynamic add** | 🔴 Hard | Existing project detection, route merging |
| **TypeScript variants** | 🟡 Medium | Conditional type annotations |
| **Full coverage** | 🔴 Hard | Testing all edge cases (JS vs TS, Tailwind vs CSS) |
