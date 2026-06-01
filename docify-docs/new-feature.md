Prism — Master Advanced Product Specification & Engineering Roadmap

Document Version: 1.1.0

Classification: Advanced Engineering Blueprint

Architecture Core: Nexo Enterprise Standard Compliant

Operational Status: Hybrid Architecture (100% Deterministic Offline Core + Extended API Sync Subsystems)

1. Architectural Vision and Core Differentiation

Prism is designed as a rigorous Engineering Automation Platform, explicitly separated from standard, general-purpose AI text generation tools. While AI systems present severe constraints regarding context drift, hallucinations, and multi-file token window choke-ups over large codebases, Prism relies on an immutable, deterministic software compilation pipeline.

Architectural Vector

General AI Prompting (e.g., ChatGPT/Cursor)

Prism CLI Engine

Execution Velocity

2-3 minute latency, manual validation, copy-paste overhead

14 seconds flat compilation directly into the host filesystem

System Determinism

Stochastic output, unstable types, drifting code paradigms

100% immutable compliance with production-ready Nexo Standards

Reference Resolution

Broken relative paths, variable collisions

Dynamic Compile-Time Path Aliases (@core/, @shared/)

Codebase Upgrades

Truncates code, fails to read massive existing environments

Incremental, non-destructive mutations via strict anchor placeholders

2. Reverse-Sync OpenAPI Engine (The Schema Transformer)

To completely eradicate the industry-wide problem of "Architecture Drift" between front-end UI states and back-end structural mutations, Prism integrates a local, zero-AI, high-performance API Sync Layer executed via:

prism sync <swagger-spec-url-or-local-json>

Domain Boundary and Module Extraction Logic

The execution layer maps a massive, unified Swagger schema file into encapsulated, domain-isolated micro-features using three cascading structural constraints:

OAS Endpoint Tags: The compiler primarily checks the endpoint's metadata block to resolve its structural parent boundary. For example, routes defined with tags: ["Users"] are automatically routed to the users feature module space.

RESTful Path Tokenization: If strict tags are absent from the back-end schema, the engine falls back to a structural path segment parser, extracting tokens from the resource route. For example, /api/v1/billing/invoices/\* triggers a base token split, capturing billing as the target domain target.

Component Entity Matching: The compiler scans the global properties inside components/schemas for explicit lexical prefixes. For example, UserResponse and CreateUserPayload are extracted and cleanly grouped inside the user management micro-context.

3. Data Integrity Enforcer: Hybrid Type Layer

Dumping all API payload definitions, request wrappers, and database models into a single monolithic file introduces catastrophic Git merge conflicts in fast-moving teams and causes the TypeScript compiler to throw circular reference exceptions. Prism enforces a decoupled Hybrid Type Layer:

A. Core Infrastructure Shared Types (src/shared/core/api/types.ts)

Houses pure, generic, structure-agnostic wrapper interfaces that serve the entire framework infrastructure:

export interface ApiResponse<T> {
data: T;
success: boolean;
message?: string;
}

export interface PaginationMeta {
page: number;
limit: number;
total: number;
totalPages: number;
}

export interface PaginatedResponse<T> {
items: T[];
pagination: PaginationMeta;
}

B. Isolated Feature Types (src/features/[feature-name]/types/index.ts)

Encapsulates localized models, request data transfer objects (DTOs), and domain boundaries specific to that feature context:

import { PaginatedResponse } from "@core/api/types"; // Explicit Import from Core Shared Infrastructure

export interface User {
id: string;
name: string;
email: string;
role: "admin" | "manager" | "dev";
}

export interface CreateUserPayload {
name: string;
email: string;
role: string;
}

// Extends the core framework primitives safely
export type UserListResponse = PaginatedResponse<User>;

4. Local Instrumentation Dashboard (The Visual Engine)

To provide developers and engineering leads with a true birds-eye view of their codebase without deploying chaotic force-directed neural network graphs (which mutate into unreadable spider-webs in large projects), Prism generates an elegant, zero-dependency local workspace platform compiled natively at docs/dashboard.html.

Right-Sized Three-Panel UI Specification

Top Control and Search Ribbon: Implements an optimized string-matching text query engine providing 0ms search latency across all endpoints, methods, and files, paired with global module scope filtering triggers (Core Infrastructure vs Isolated Feature Blocks).

Left Codebase Tree Explorer: Dynamically lists folders, feature layers, and structural file positions rendered via a nested tree view component that mimics advanced IDE environments.

Right Context Architecture Canvas: Acts as a rich data visualizer for the focused explorer node, detailing exact underlying metadata metrics, matching REST endpoints, imported helper utilities, active Zustand stores, and validation parameters.

+-----------------------------------------------------------------------------------+
| Prism Project Insights [ Search... ] [ Filter: Features ] |
+---------------------------------------------------+-------------------------------+
| MODULE DIRECTORY | src/features/users (FEATURE) |
| | |
| > src/shared/core/api | User management CRUD module. |
| v src/features/users | |
| - usersService.ts | Generated Files: |
| - useUsersList.ts | - usersService.ts |
| - UsersListPage.tsx | - useUsersList.ts |
| > src/features/billing | |
| | Connected Endpoints: |
| | - GET /api/users |
| | - POST /api/users |
+---------------------------------------------------+-------------------------------+

5. Non-Destructive Code Injection and Config-Driven UI

To execute fully automated code injections during terminal operations without risking syntax corruption or character breakages inside pre-existing production systems, Prism leverages deterministic anchor string tokens and modular decoupled layout configurations.

Context-Aware Anchor Code Injection Pattern

When injecting novel incremental routing entities into pre-existing modules, the file-writer reads the targeted file, scans for explicit structural anchor tokens, and applies a precise replacement array while preserving the runtime execution thread:

// Inside src/shared/core/api/apiRoutes.ts
export const API_ROUTES = {
auth: { ... },
users: { ... },
// [PRISM-INJECT-NEW-API-ROUTE-HERE] <-- Immutable Compiler Anchor Node
} as const;

Config-Driven Component Extensions

Front-end primitives (such as data tables, filter configurations, and transaction forms) are architected as decoupled configuration schema matrices rather than hardcoded rows. When the OpenAPI sync engine processes a schema mutation, the CLI manipulates only the data array parameters, keeping the component layout untouched:

// Inside src/features/users/constants/index.ts
export const USER_COLUMNS = [
{ header: "ID", key: "id" },
{ header: "Name", key: "name" },
// [PRISM-DYNAMIC-COLUMNS] <-- Safely mutates here without touching the UI rendering code
];

6. Offline Capabilities and System Constraints

Prism is architected to run completely locally, protecting proprietary corporate codebase structures from public leaks or cloud dependency costs.

Hard Drive Execution

The template engine resides globally within the local installation directory. When the user executes a command, raw EJS strings compile via standard CPU processing and map directly to the system storage using Node.js filesystem modules. No internet data transit or remote API tokens are required.

The Package Management Exception

The absolute core code scaffold compiles 100% offline. However, resolving external library dependencies (fetching the actual code for libraries like React, Zustand, or Axios specified in the compiled package.json) requires a network-connected package manager installation.

Developers operating in restricted environments can circumvent this network dependency using local dependency caching configurations:

npm install --offline

7. Asynchronous Pipeline Operations and Write Safety

To manage bulk file creations on disk without introducing process blocks, Prism utilizes asynchronous file streams and transaction staging routines.

Concurrent Performance via Promise Pools

Writing 80 to 120 files sequentially blocks the single thread of Node.js. Prism prevents this bottleneck by packaging every generation pipeline into an asynchronous Promise pool, triggering parallel execution threads via Node.js system routines:

async function writeAllFiles(targetDir: string, generatedFiles: GeneratedFile[]) {
const writePromises = generatedFiles.map(async (file) => {
const fullPath = path.join(targetDir, file.path);
await fs.ensureDir(path.dirname(fullPath));
await fs.writeFile(fullPath, file.content, "utf-8");
});
await Promise.all(writePromises);
}

Atomic Staging Transactions

To avoid creating half-written, broken, or corrupted project directories in the event of an unexpected execution interrupt, Prism processes all files through a temporary workspace:

Files write directly into a local hidden directory: .prism-temp-build/

If all Promises settle successfully with zero errors, Prism runs an atomic folder swap to the final target path.

If any generator throws an error, Prism rolls back the transaction, purging the temporary path completely to keep the developer's computer clean.

8. Step-by-Step AI Execution and Implementation Strategy

To completely remove development friction and prevent complexity blocks, you will utilize AI as a highly tactical Junior Developer. Do not attempt to write this all at once. Follow this strict modular roadmap:

Milestone 1: The Nexo Admin Anchor (100% Core Priority First)

Complete all core capabilities of your flagship Nexo Admin application manually or via focused AI assistance.

Lock down the definitive production folder structures, Zustand selector workflows, and token refresh queues.

Your Prism tool cannot create an architecture that does not yet exist in its final, stable form.

Milestone 2: The CLI Base Engine (Isolated AI Prompting)

Once Nexo Admin is stable, initialize Prism's CLI using strict, file-by-file prompts to build the foundation.

Prompt Day 1: "Write a clean Node.js CLI boilerplate using Commander.js and Inquirer.js that accepts project initialization preferences and exports them to a prism.config.json file."

Prompt Day 2: "Create an asynchronous file writer module using fs-extra and Promise.all() that reads an EJS template from memory and cleanly drops it onto the local disk."

Milestone 3: Dynamic Sync and Dashboard Compilation

Prompt Day 3: "Build an isolated module using the swagger-parser npm package that ingests a Swagger API JSON file and returns a clean, structured metadata array tracking endpoints, schemas, and tags."

Prompt Day 4: "Write a code-generation function that transforms the extracted Swagger metadata array into a static, zero-dependency Tailwind HTML page and writes it directly to docs/dashboard.html."
