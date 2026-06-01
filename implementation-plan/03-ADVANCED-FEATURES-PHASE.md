# Phase 3: Advanced Features — OpenAPI Sync, Dashboard, Anchor Injection

> **Duration:** ~4 milestones
> **Goal:** `docify sync` parses Swagger → generates features + dashboard.

---

## Milestone 3.1: OpenAPI/Swagger Sync Engine

**Command:** `docify sync <spec-url-or-path>`

### Tasks

- [ ] Parse OpenAPI 3.0 / Swagger 2.0 specs
- [ ] Extract domain boundaries via tags, path tokens, and component entity matching
- [ ] Generate feature modules from extracted endpoints
- [ ] Generate API route definitions
- [ ] Generate feature types (DTOs, response models)
- [ ] Generate service files with CRUD operations
- [ ] Generate TanStack Query hooks with proper query keys
- [ ] Handle nested schemas, allOf, oneOf, and references ($ref)
- [ ] Support dry-run mode (`--dry-run`) for preview

### Architecture

```typescript
// src/sync/openapi-parser.ts
interface ParsedEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  tags: string[];
  operationId: string;
  parameters: ParamDefinition[];
  requestBody?: BodyDefinition;
  responses: Record<string, ResponseDefinition>;
}

interface ParsedSchema {
  name: string;
  properties: PropertyDefinition[];
  required: string[];
  description: string;
}

class OpenAPIParser {
  async parse(spec: string): Promise<ParsedAPI> {
    const parsed = await SwaggerParser.validate(spec);
    return {
      endpoints: this.extractEndpoints(parsed),
      schemas: this.extractSchemas(parsed),
      domainBoundaries: this.detectDomainBoundaries(parsed),
    };
  }

  /** Domain boundary detection with 3 cascading strategies */
  private detectDomainBoundaries(spec: any): DomainBoundary[] {
    const boundaries: DomainBoundary[] = [];
    const paths = spec.paths || {};

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(methods as any)) {
        if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;

        // Strategy 1: OAS Tags
        if (operation.tags?.length > 0) {
          for (const tag of operation.tags) {
            this.addToBoundary(boundaries, tag, { method, path, operation });
          }
          continue;
        }

        // Strategy 2: Path tokenization
        const segments = path.split("/").filter(Boolean);
        const domainCandidate = segments.find(
          (s) => !s.startsWith("{") && !s.startsWith("v") && isNaN(Number(s))
        );
        if (domainCandidate) {
          this.addToBoundary(boundaries, domainCandidate, { method, path, operation });
        }
      }
    }

    return boundaries;
  }
}
```

### Feature Generation from Swagger

```typescript
// src/sync/sync-command.ts
class SyncCommand {
  async execute(specPath: string, options: SyncOptions): Promise<void> {
    // 1. Parse the spec
    const parser = new OpenAPIParser();
    const api = await parser.parse(specPath);

    // 2. For each domain boundary, generate feature module
    for (const boundary of api.domainBoundaries) {
      const featureName = toKebabCase(boundary.name);

      // Generate types
      const featureTypes = api.schemas
        .filter(s => s.name.toLowerCase().startsWith(boundary.name.toLowerCase()))
        .map(schema => this.generateFeatureType(schema));

      // Generate service
      const endpoints = boundary.endpoints.map(ep => this.generateEndpoint(ep));
      const serviceCode = this.generateService(featureName, endpoints);

      // Generate query keys + hooks
      const listEndpoint = endpoints.find(ep => ep.method === "GET" && !ep.path.includes("{"));
      const detailEndpoint = endpoints.find(ep => ep.method === "GET" && ep.path.includes("{"));
      const hooksCode = this.generateHooks(featureName, listEndpoint, detailEndpoint);

      // Write files
      await this.fileWriter.writeAll(targetDir, [
        { path: `src/features/${featureName}/types/index.ts`, content: featureTypes },
        { path: `src/features/${featureName}/services/${featureName}Service.ts`, content: serviceCode },
        { path: `src/features/${featureName}/hooks/queryKeys.ts`, content: this.generateQueryKeys(featureName) },
        { path: `src/features/${featureName}/hooks/use${toPascalCase(featureName)}List.ts`, content: hooksCode },
        { path: `src/features/${featureName}/index.ts`, content: this.generateBarrel(featureName) },
      ]);

      // Update API routes (anchor injection)
      this.injectApiRoutes(boundary);
    }
  }
}
```

### Edge Cases for OpenAPI Sync

| Edge Case | Handling |
|-----------|----------|
| `$ref` resolution (external files) | Resolve all `$ref` before processing |
| Circular references in schemas | Detect circular refs, break with `any` fallback |
| `allOf` / `oneOf` / `anyOf` | Flatten allOf, generate discriminated union for oneOf |
| Parameters in path vs query vs header | Extract all parameter types, generate proper types |
| No tags on any endpoint | Fall back entirely to path tokenization |
| Undocumented endpoints (x-internal) | Skip when marked as internal |
| Very large specs (1000+ endpoints) | Process in batches, show progress bar |
| Swagger 2.0 vs OpenAPI 3.0 | Detect version, use appropriate parser |
| Security schemes (Bearer, API Key, OAuth2) | Translate to auth interceptor configuration |
| Response status codes beyond 200 | Handle 201 (created), 204 (no content), 4xx, 5xx |

---

## Milestone 3.2: Non-Destructive Anchor Injection

### Tasks

- [ ] Define anchor markers in generated files
- [ ] Implement injector for API routes
- [ ] Implement injector for router config
- [ ] Implement injector for sidebar navigation
- [ ] Implement injector for DataTable columns
- [ ] Implement injector for store slices
- [ ] Add rollback capability for failed injections

### Anchor Markers

```typescript
// src/utils/anchor-injector.ts

const ANCHOR_PATTERNS = {
  API_ROUTES: "// [DOCIFY-INJECT-NEW-API-ROUTE-HERE]",
  ROUTER: "// [DOCIFY-INJECT-ROUTE-HERE]",
  SIDEBAR: "// [DOCIFY-INJECT-SIDEBAR-ITEM-HERE]",
  COLUMNS: "// [DOCIFY-DYNAMIC-COLUMNS]",
  STORE: "// [DOCIFY-INJECT-STORE-SLICE-HERE]",
  PROVIDERS: "// [DOCIFY-INJECT-PROVIDER-HERE]",
} as const;

class AnchorInjector {
  async inject(
    filePath: string,
    anchorPattern: string,
    newContent: string,
    context: { after?: boolean; indent?: number } = {}
  ): Promise<boolean> {
    // 1. Read file
    const content = await fs.readFile(filePath, "utf-8");

    // 2. Find anchor
    const anchorIndex = content.indexOf(anchorPattern);
    if (anchorIndex === -1) {
      throw new DocifyError(
        `Anchor ${anchorPattern} not found in ${filePath}`,
        ErrorCode.ANCHOR_NOT_FOUND,
        "Run docify init first"
      );
    }

    // 3. Determine insert position (before or after anchor)
    const insertPos = context.after
      ? anchorIndex + anchorPattern.length
      : anchorIndex;

    // 4. Insert content with proper indentation
    const indent = " ".repeat(context.indent ?? 2);
    const formattedContent = newContent
      .split("\n")
      .map((line) => (line.trim() ? indent + line : line))
      .join("\n");

    const newFileContent =
      content.slice(0, insertPos) +
      "\n" +
      formattedContent +
      "\n" +
      content.slice(insertPos);

    // 5. Write back
    await fs.writeFile(filePath, newFileContent, "utf-8");
    return true;
  }

  async injectApiRoute(routeName: string, routePath: string): Promise<void> {
    const filePath = "src/shared/core/api/apiRoutes.ts";
    const content = `  ${toCamelCase(routeName)}: {\n    list: "/${routePath}",\n    detail: (id: string) => \`/${routePath}/\${id}\`,\n    create: "/${routePath}",\n    update: (id: string) => \`/${routePath}/\${id}\`,\n    delete: (id: string) => \`/${routePath}/\${id}\`,\n  },`;
    await this.inject(filePath, ANCHOR_PATTERNS.API_ROUTES, content, { after: true, indent: 2 });
  }

  async injectRoute(featureName: string, path: string): Promise<void> {
    const filePath = "src/shared/routes/index.tsx";
    const content = `{ path: "${path}", element: <SuspenseWrapper><${toPascalCase(featureName)}ListPage /></SuspenseWrapper> },`;
    // Also need to add the lazy import at top
    const importContent = `const ${toPascalCase(featureName)}ListPage = lazy(() => import("@features/${featureName}/pages/${toPascalCase(featureName)}ListPage"));\nconst ${toPascalCase(featureName)}DetailPage = lazy(() => import("@features/${featureName}/pages/${toPascalCase(featureName)}DetailPage"));`;
    await this.inject(filePath, "// [DOCIFY-INJECT-LAZY-IMPORT-HERE]", importContent, { after: true, indent: 0 });
    await this.inject(filePath, ANCHOR_PATTERNS.ROUTER, content, { after: true, indent: 6 });
  }
}
```

### Edge Cases for Anchor Injection

| Edge Case | Handling |
|-----------|----------|
| Anchor marker deleted by user | Show warning, suggest re-running `docify init` |
| Multiple anchor instances in same file | Inject at first instance only, add counter |
| File has been heavily modified | Detect structural changes, use fuzzy match fallback |
| No existing file to inject into | Create file with anchor marker included |
| Injection creates duplicate entries | Deduplicate before writing |
| Syntax error after injection | Run prettier formatter, check for parse errors |

---

## Milestone 3.3: Local Instrumentation Dashboard

**Output:** `docs/dashboard.html` — A standalone, zero-dependency HTML page.

### Tasks

- [ ] Parse project structure and generate metadata
- [ ] Generate three-panel dashboard UI
- [ ] Implement search functionality (pure JS, 0ms)
- [ ] Implement tree explorer with folder nesting
- [ ] Implement context architecture canvas
- [ ] Show REST endpoints per feature
- [ ] Show dependency graph
- [ ] Show Zustand stores per feature
- [ ] Dark mode for dashboard
- [ ] Export as single self-contained HTML file

### Dashboard Structure

```html
<!-- Generated: docs/dashboard.html -->
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Docify — Project Insights</title>
  <style>
    /* All CSS inlined — zero dependencies */
    :root {
      --sidebar-width: 300px;
      --header-height: 56px;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-tertiary: #f1f5f9;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #94a3b8;
      --border-color: #e2e8f0;
      --accent: #3b82f6;
      --accent-light: #eff6ff;
    }
    /* ... 500+ lines of embedded CSS ... */
  </style>
</head>
<body>
  <!-- Top Ribbon: Search + Filters -->
  <header class="top-bar">
    <div class="logo">Docify <span class="badge">v1.0.0</span></div>
    <div class="search-bar">
      <input type="text" id="search" placeholder="Search endpoints, files, features..." />
      <span class="shortcut">⌘K</span>
    </div>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="core">Core</button>
      <button class="filter-btn" data-filter="feature">Features</button>
      <button class="filter-btn" data-filter="ui">UI</button>
    </div>
  </header>

  <div class="main-container">
    <!-- Left Panel: Tree Explorer -->
    <aside class="tree-panel">
      <div class="tree-header">
        <span>Module Directory</span>
        <button id="expandAll">Expand All</button>
      </div>
      <div id="treeView" class="tree-view">
        <!-- Dynamically rendered by JavaScript -->
      </div>
    </aside>

    <!-- Right Panel: Context Canvas -->
    <main class="canvas-panel">
      <div id="canvasContent" class="canvas-content">
        <div class="welcome-message">
          <h1>🎯 Welcome to Docify Insights</h1>
          <p>Select a module from the tree to explore its architecture.</p>
        </div>
      </div>
    </main>
  </div>

  <script>
    // All JavaScript inlined — zero dependencies
    const projectData = /* JSON data injected at generation time */;

    // 0ms search implementation
    function search(query) {
      const results = [];
      const lowerQuery = query.toLowerCase();

      function walkTree(node) {
        if (node.name.toLowerCase().includes(lowerQuery)) {
          results.push(node);
        }
        if (node.children) node.children.forEach(walkTree);
        if (node.endpoints) {
          node.endpoints.forEach(ep => {
            if (ep.path.toLowerCase().includes(lowerQuery) ||
                ep.method.toLowerCase().includes(lowerQuery)) {
              results.push({ ...ep, parent: node });
            }
          });
        }
      }

      projectData.features.forEach(walkTree);
      return results;
    }

    // Tree renderer
    function renderTree(container, nodes, depth = 0) {
      nodes.forEach(node => {
        const item = document.createElement('div');
        item.className = `tree-item ${depth > 0 ? 'nested' : ''}`;
        item.style.paddingLeft = `${depth * 20 + 12}px`;
        item.innerHTML = `
          <span class="tree-icon">${node.type === 'folder' ? '📁' : '📄'}</span>
          <span class="tree-name">${node.name}</span>
          ${node.badge ? `<span class="tree-badge">${node.badge}</span>` : ''}
        `;
        item.addEventListener('click', () => showContext(node));
        container.appendChild(item);

        if (node.children) {
          const childContainer = document.createElement('div');
          childContainer.className = 'tree-children';
          renderTree(childContainer, node.children, depth + 1);
          container.appendChild(childContainer);
        }
      });
    }

    // Context canvas renderer
    function showContext(node) {
      const canvas = document.getElementById('canvasContent');
      if (node.type === 'feature') {
        canvas.innerHTML = `
          <div class="context-header">
            <h2>📍 ${node.name}</h2>
            <span class="chip">FEATURE</span>
            <p class="description">${node.description || 'Auto-generated feature module.'}</p>
          </div>
          <div class="context-grid">
            <div class="context-card">
              <h3>📦 Generated Files</h3>
              <ul>${node.files.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>
            <div class="context-card">
              <h3>🔗 Connected Endpoints</h3>
              <ul>${node.endpoints.map(ep => `
                <li class="endpoint">
                  <span class="method method-${ep.method.toLowerCase()}">${ep.method}</span>
                  <code>${ep.path}</code>
                </li>
              `).join('')}</ul>
            </div>
            <div class="context-card">
              <h3>⚡ Zustand Stores</h3>
              <ul>${node.stores?.map(s => `<li>${s}</li>`).join('') || '<li class="empty">None</li>'}</ul>
            </div>
          </div>
        `;
      }
    }
  </script>
</body>
</html>
```

### Dashboard Data Generation

```typescript
// src/generators/doc-generator.ts — dashboard builder
private buildDashboardData(config: DocifyConfig): ProjectData {
  return {
    version: config.project.version,
    generatedAt: new Date().toISOString(),
    features: config.structure.features.map((feature) => ({
      name: feature,
      type: "feature",
      description: `${toTitleCase(feature)} management feature module.`,
      files: [
        `${feature}Service.ts`,
        `use${toPascalCase(feature)}List.ts`,
        `use${toPascalCase(feature)}Mutations.ts`,
        `${toPascalCase(feature)}ListPage.tsx`,
        `${toPascalCase(feature)}DetailPage.tsx`,
        `${toPascalCase(feature)}Form.tsx`,
      ],
      endpoints: [
        { method: "GET", path: `/api/${feature}` },
        { method: "GET", path: `/api/${feature}/:id` },
        { method: "POST", path: `/api/${feature}` },
        { method: "PUT", path: `/api/${feature}/:id` },
        { method: "DELETE", path: `/api/${feature}/:id` },
      ],
      stores: [`use${toPascalCase(feature)}Store`],
    })),
    coreModules: [
      { name: "api", type: "core", files: ["client.ts", "apiRoutes.ts", "types.ts"] },
      { name: "auth", type: "core", files: ["AuthContext.tsx", "sessionService.ts"] },
      { name: "lib", type: "core", files: ["queryClient.ts", "store.ts", "cn.ts"] },
    ],
    uiComponents: [
      "Button", "Input", "Badge", "Card", "Modal", "Select",
      "Tabs", "Switch", "Toast", "Tooltip", "Skeleton", "Avatar",
      "Dropdown", "DataTable", "Pagination", "EmptyState", "ErrorBoundary",
    ],
  };
}
```

### Edge Cases for Dashboard

| Edge Case | Handling |
|-----------|----------|
| Very large project (100+ features) | Lazy-load tree nodes on expand, virtual scroll |
| No features (flat structure) | Show meaningful "No features" state |
| Missing file references | Graceful fallback with "Not found" indicator |
| Dashboard file too large | Tree-shake unused metadata, compress JSON |
| Browser compatibility | Use ES2015+ syntax, no external dependencies |

---

## Milestone 3.4: Config-Driven Column & Form System

### Tasks

- [ ] Implement config-driven DataTable columns
- [ ] Implement config-driven form schemas
- [ ] Generate column definitions from OpenAPI schemas
- [ ] Sync column updates from OpenAPI sync command

### Column Configuration Schema

```typescript
// Generated: src/features/users/constants/index.ts
import type { ColumnDef } from "@components/ui/DataTable";
import type { User } from "../types";

export const USER_COLUMNS: ColumnDef<User>[] = [
  { header: "ID", key: "id", width: 80 },
  { header: "Name", key: "name", width: 200 },
  { header: "Email", key: "email", width: 250, copyable: true },
  { header: "Role", key: "role", width: 120,
    render: (value) => <Badge variant={roleBadgeVariant(value)}>{value}</Badge>
  },
  { header: "Status", key: "status", width: 120 },
  { header: "Created", key: "createdAt", width: 150,
    render: (value) => <DateCell value={value} format="relative" />
  },
  { header: "", key: "actions", width: 100, sortable: false },
  // [DOCIFY-DYNAMIC-COLUMNS] — Columns injected by sync command
];

export const USER_FORM_FIELDS = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "role", label: "Role", type: "select", required: true,
    options: [
      { value: "admin", label: "Admin" },
      { value: "manager", label: "Manager" },
      { value: "dev", label: "Developer" },
    ]
  },
  { name: "status", label: "Status", type: "select", required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]
  },
  // [DOCIFY-DYNAMIC-FORM-FIELDS] — Fields injected by sync command
] as const;
```

### Edge Cases for Config-Driven UI

| Edge Case | Handling |
|-----------|----------|
| Schema change breaks component rendering | Add validation that column keys match schema |
| Reordering columns from API | Support `order` field in column config |
| Hidden columns from API | Support `visible: false` flag |
| Type mismatch (e.g., date as string) | Add type coercion layer for rendering |
