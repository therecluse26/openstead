# RESEARCH.md - Deep Context & Historical Documentation

**Last Updated:** 2026-02-12
**Project:** Openstead - Open-source homestead management platform
**Purpose:** Historical context, architectural decisions, and design philosophy

> **Audience:** This document provides deep contextual information for developers, contributors, and AI agents seeking to understand the "why" behind Openstead's design decisions. For practical implementation guidance, see `CLAUDE.md`.

---

## Table of Contents

1. [Project Genesis & History](#project-genesis--history)
2. [Architectural Decision Records](#architectural-decision-records)
3. [Multi-Tenancy Deep Dive](#multi-tenancy-deep-dive)
4. [Permission System Design Philosophy](#permission-system-design-philosophy)
5. [Technology Choices & Rationale](#technology-choices--rationale)
6. [Future Roadmap & Planned Features](#future-roadmap--planned-features)
7. [Known Limitations & Technical Debt](#known-limitations--technical-debt)
8. [Development Patterns & Best Practices](#development-patterns--best-practices)
9. [External Dependencies & Integrations](#external-dependencies--integrations)
10. [Related Projects & Inspirations](#related-projects--inspirations)
11. [Community & Contribution Context](#community--contribution-context)
12. [Design Patterns Used Throughout](#design-patterns-used-throughout)
13. [Performance Considerations](#performance-considerations)
14. [Security Considerations](#security-considerations)

---

## Project Genesis & History

### Origin Story

Openstead was created as a personal solution to a real-world problem: managing a homestead/farm efficiently without expensive proprietary software. The project began in September 2022 with the goal of building an open-source, self-hostable alternative to commercial farm management systems.

The founder, a software developer with homesteading experience, recognized that existing solutions were either:
- **Too expensive:** Commercial farm management software with recurring subscription fees
- **Too complex:** Enterprise agricultural systems designed for large-scale operations
- **Too limited:** Simple spreadsheets that didn't scale or provide relationships between data
- **Not self-hostable:** Cloud-only solutions with vendor lock-in

The vision was clear: create a modern, full-featured homestead management platform that anyone could run on their own infrastructure, modify to their needs, and contribute improvements back to the community.

### Development Timeline

**September 2022 - Initial Development**
- **First Commit:** Set up monorepo structure with Laravel backend and Next.js frontend
- **Foundation:** Laravel Breeze Next.js starter kit chosen as base for authentication and API scaffolding
- **Architecture Decision:** API-first design with separate frontend/backend for future flexibility
- **Deployment:** Initial deployment to Vercel (frontend) and Railway (backend)

**Key Commit:** `Build base next-js implementation and deployment` (PR #1)
- Established the foundational architecture that remains today
- Set up Docker development environment
- Configured Laravel Sanctum for SPA authentication

**June 2023 - Inventory Management**
- **Major Feature:** Complete inventory system implementation (PR #9)
- Added livestock tracking with genealogy relationships
- Seed inventory with hardiness zones and growing information
- Equipment tracking with service history
- Pantry items with expiration tracking
- Polymorphic notes and service logs

**Key Innovation:** The decision to use polymorphic relationships for notes and service logs proved crucial, allowing any entity to have notes and maintenance records without schema duplication.

**August 2023 - Project Management**
- **Feature:** Kanban-style project boards (PR #22)
- Project items with assignees and due dates
- Workflow statuses (Backlog, To Do, In Progress, Done)
- Project membership with owner designation

**Interesting Note:** The developer noted in PR #22: "Still need custom workflow builder component, and that should be enough to call it fully complete." This became GitHub issue #21, which remains open today.

**August 2023 - Authorization System Refinement**
- **Major Refactor:** Role and permission system overhaul (commits 1756458, 9d08760)
- Moved from simple role-based to granular permission-based authorization
- Implemented `resource:action` permission naming convention
- Created AuthorizationStore and Restrict component for frontend

**Evolution Pattern:** The project started with coarse-grained roles (Admin, User) and evolved to fine-grained permissions (inventory:create, project:update, etc.) as complexity grew. This demonstrates thoughtful iteration based on real needs rather than premature optimization.

**September 2023 - User Management**
- **Feature:** User CRUD, invitation system foundation (PR #26-28)
- Database migration from MySQL to PostgreSQL (later reverted to MySQL)
- Fixed permission issues with user management endpoints

**July 2024 - Multi-Tenancy (Recent)**
- **Major Milestone:** Multi-tenancy implementation (PR #29, merged July 2025)
- Longest-running feature branch (~12 months of development)
- Single-database strategy with Stancl Tenancy package
- Tenant-specific roles and permissions via pivot table
- Frontend TenantStore with localStorage persistence
- Complete refactor of data access patterns

**Critical Decision:** The team chose single-database multi-tenancy over separate databases per tenant. This was a deliberate trade-off favoring operational simplicity over complete isolation (see ADR section below).

**July 2024 - TypeScript Migration (Ongoing)**
- **Branch:** `feature/typescript` (commit 7402f7f)
- Gradual conversion of frontend to TypeScript
- Stores converted first (TenantStore, AuthorizationStore, ProjectStore)
- Components being converted incrementally
- Forms and services remain mostly JavaScript

**Pattern:** The TypeScript migration demonstrates a pragmatic approach—convert high-value files first (stores, critical components) rather than big-bang rewrite.

### Evolution of Development Patterns

The codebase shows clear evolution in architectural sophistication:

**Phase 1: Direct Model Usage (Early 2022)**
- Controllers directly used Eloquent models
- Business logic mixed in controllers
- Limited code reuse

**Phase 2: Service Layer Introduction (Mid 2023)**
- Services extracted for business logic
- Controllers became thinner
- But data access still coupled to services

**Phase 3: Repository Pattern (Late 2023)**
- Repositories abstracted data access
- Polymorphic repositories (InventoryRepository accepts any Inventoriable)
- Enabled better testing and separation of concerns

**Phase 4: Trait Composition (2024)**
- Models compose functionality via traits (HasNotes, HasImages, BelongsToTenant)
- Reduced code duplication
- Cleaner model definitions

This progression shows learning and refinement rather than premature architecture—a sign of healthy software evolution.

---

## Architectural Decision Records

### ADR 1: Why Laravel + Next.js?

**Decision:** Monorepo with separate Laravel API backend and Next.js SPA frontend

**Context:**
The project needed a modern, maintainable stack that could:
- Provide robust API capabilities with minimal boilerplate
- Offer excellent developer experience for building SPAs
- Support independent scaling of frontend and backend
- Enable future mobile app development (React Native shares React knowledge)

**Rationale:**

**Laravel Benefits:**
- Mature, well-documented PHP framework with 10+ years of development
- Excellent ORM (Eloquent) for relationship-heavy data models (livestock genealogy, project hierarchies)
- Built-in authentication (Sanctum) designed for SPAs
- Strong package ecosystem (Stancl Tenancy, Spatie MediaLibrary)
- Developer familiar with Laravel ecosystem (reduced ramp-up time)
- PHP 8.1 enums perfect for permission system
- Active community and long-term support

**Next.js Benefits:**
- React-based (huge ecosystem, strong community)
- File-based routing (intuitive for page-heavy applications)
- Image optimization out-of-the-box
- Code splitting and performance optimizations
- SSR capabilities (though less critical for authenticated dashboards)
- Large talent pool familiar with React

**Why Monorepo:**
- Shared git history and version control
- Easier cross-reference between frontend/backend during development
- Single repository for issues and pull requests
- Simplified local development setup

**Alternatives Considered:**

1. **Laravel Livewire (Full-Stack Laravel)**
   - **Pros:** Single framework, no API layer needed, simpler deployment
   - **Cons:**
     - Less separation of concerns
     - Harder to build mobile app later (would need separate API anyway)
     - Frontend tied to backend deployment
     - Livewire less mature for complex SPAs than React
   - **Rejected:** Wanted true SPA experience with potential for mobile app

2. **Full-Stack Next.js (API Routes + Frontend)**
   - **Pros:** Single framework, JavaScript/TypeScript throughout
   - **Cons:**
     - Laravel's ecosystem too valuable (Eloquent, packages)
     - Next.js API routes less robust than Laravel for complex business logic
     - PHP more performant for backend tasks than Node.js for this use case
   - **Rejected:** Laravel's strengths outweighed single-language benefit

3. **Separate Repositories (Backend + Frontend)**
   - **Pros:** Complete independence, easier to deploy to different teams
   - **Cons:**
     - Solo developer would manage two repos
     - Cross-referencing harder
     - Dependency version mismatches harder to track
   - **Rejected:** Monorepo simpler for solo/small team

**Trade-offs Accepted:**
- **More complex deployment:** Two services instead of one (mitigated by Docker and Railway)
- **CORS configuration required:** Cross-origin requests need proper setup
- **State synchronization:** Frontend/backend state must be kept in sync
- **Language context switching:** PHP ↔ JavaScript throughout development

**Trade-offs Gained:**
- **Better separation of concerns:** API can serve multiple frontends (web, mobile)
- **Independent scaling:** Can scale API servers separately from frontend servers
- **Team flexibility:** Future frontend/backend specialists can work independently
- **Future-proof:** Easy to add mobile app, desktop app, or third-party API integrations

**Validation:**
After 2+ years of development, this decision has proven sound. The monorepo structure works well for a solo developer, and the separation has enabled clean architecture with minimal coupling.

---

### ADR 2: Single-Database Multi-Tenancy

**Decision:** Use Stancl Tenancy package with single-database strategy (tenant_id columns) rather than separate databases per tenant

**Context:**
The application needed to support multiple homesteads/farms on a single installation. Multi-tenancy was identified early as a requirement but wasn't implemented until July 2024 (nearly 2 years into development). This delay allowed the team to understand data access patterns before committing to a tenancy strategy.

**Rationale:**

**Single-Database Benefits:**
- **Operational simplicity:** One database connection, one backup, one migration
- **Lower resource usage:** No connection pool multiplication
- **Easier cross-tenant features:** If needed, can query across tenants (e.g., global variety database)
- **Faster queries for small datasets:** No connection overhead per request
- **Simpler development:** Familiar query patterns, no database switching complexity

**Stancl Tenancy Benefits:**
- **Most popular Laravel tenancy package:** Large community, active maintenance
- **Flexible:** Supports both single-DB and multi-DB strategies
- **Well-documented:** Extensive documentation and examples
- **Middleware-based:** Clean integration via InitializeTenancyByRequestData
- **Bootstrappers:** Modular tenant isolation (cache, filesystem, queues)

**Implementation Details:**
- All tenant-scoped models have `tenant_id` column (indexed)
- `BelongsToTenant` trait adds global scope automatically filtering by tenant
- Middleware extracts tenant from `X-Tenant` header or query parameter
- User-tenant relationship many-to-many (single user can access multiple tenants)
- Roles/permissions stored per-tenant in `tenant_users` pivot table

**Alternatives Considered:**

1. **Separate Database Per Tenant**
   - **Pros:**
     - Complete data isolation (better security)
     - Can scale individual tenants to dedicated hardware
     - Easier to export/backup individual tenant
   - **Cons:**
     - Connection pool overhead (one pool per active tenant)
     - Complex migrations (must run across all tenant databases)
     - Harder to implement cross-tenant features
     - Higher operational complexity (backup scripts, monitoring)
   - **Rejected:** Operational complexity not worth it for target scale (<1000 tenants)

2. **Subdomain-Based Tenant Identification**
   - **Pros:**
     - More "branded" experience (farmname.openstead.app)
     - Cleaner URL structure
   - **Cons:**
     - Requires DNS configuration (wildcard SSL certificate)
     - More complex deployment
     - Header-based simpler for API-first architecture
   - **Rejected:** Header-based identification simpler and more flexible

3. **No Multi-Tenancy (User-Based Isolation Only)**
   - **Pros:**
     - Simplest implementation
     - No tenant context to manage
   - **Cons:**
     - Doesn't match real-world use case (farms as organizational units)
     - Can't have multiple users per farm with different permissions
     - No clear ownership model
   - **Rejected:** Core requirement for shared hosting model

**Trade-offs Accepted:**
- **Risk of data leakage:** If tenant scoping fails, data could leak (mitigated by middleware + global scopes + tests)
- **Single database growth:** One database grows with all tenants (acceptable for target scale)
- **Less isolation:** Noisy neighbor problem possible (one tenant's load affects others)

**Trade-offs Gained:**
- **Operational simplicity:** Single database to manage, monitor, backup
- **Faster development:** Simpler query patterns, no database switching logic
- **Lower costs:** Fewer database instances needed
- **Easier debugging:** All data in one place

**Security Mitigations:**
- Middleware validates user belongs to requested tenant (403 if not)
- Global scopes automatically added to all queries (double protection)
- Non-sequential ULIDs prevent tenant ID guessing
- File storage scoped by tenant via FilesystemTenancyBootstrapper
- Feature tests verify tenant isolation

**Validation:**
Multi-tenancy was successfully implemented in PR #29 after 12 months of design consideration. The single-database approach has proven manageable and performant for the current scale. The team can migrate to multi-database strategy later if needed (Stancl Tenancy supports both).

---

### ADR 3: Repository Pattern Adoption

**Decision:** Use Repository pattern for all data access operations

**Context:**
Early versions of the application had controllers directly using Eloquent models. As the codebase grew, this led to:
- Code duplication across controllers (same queries repeated)
- Difficult testing (hard to mock Eloquent models)
- Business logic mixed with data access logic
- Tight coupling between controllers and models

**Rationale:**

**Benefits:**
- **Centralized query logic:** Complex queries written once, reused everywhere
- **Testability:** Easy to mock repositories in unit tests
- **Abstraction:** Controllers don't know about database structure
- **Polymorphism:** Single repository can serve multiple models (InventoryRepository accepts any Inventoriable)
- **Flexibility:** Can swap data sources (e.g., add caching layer) without changing controllers

**Implementation Pattern:**
```php
// Contract defines interface
interface Repository {
    public function all(): Collection;
    public function getById(string $id): Model;
    public function delete(Model|int|string $model): ?bool;
}

// Repository implements interface
class InventoryRepository implements Repository {
    public function __construct(Inventoriable|Model $model) {
        $this->model = $model;
    }
    // ...
}

// Controller injects repository
class LivestockController {
    public function __construct() {
        $this->repository = new InventoryRepository(new Livestock());
    }
}
```

**Alternatives Considered:**

1. **Direct Model Usage**
   - **Pros:** Simpler, less abstraction, fewer files
   - **Cons:** Code duplication, hard to test, tight coupling
   - **Rejected:** Doesn't scale as complexity grows

2. **Active Record Pattern Only**
   - **Pros:** Laravel's default, very simple
   - **Cons:** Models become "god objects" with too many responsibilities
   - **Rejected:** Separation of concerns important for maintainability

3. **CQRS (Command Query Responsibility Segregation)**
   - **Pros:** Complete separation of reads/writes
   - **Cons:** Overkill for current application complexity
   - **Rejected:** Too complex for current needs

**Trade-offs Accepted:**
- **More files:** One repository per domain (but organized clearly)
- **Slight learning curve:** Contributors need to understand repository pattern
- **Indirect data access:** Can't directly call `Livestock::find($id)` in controllers

**Trade-offs Gained:**
- **Much better testability:** Can mock repositories easily
- **Centralized logic:** Query changes in one place
- **Type safety:** Repository contracts ensure consistent interface
- **Polymorphic repositories:** One repository serves multiple models

**Evolution:**
The repository pattern was introduced mid-2023 (around the inventory feature). Older parts of the codebase (authentication, some user management) still use direct model access. This shows pragmatic refactoring—new features use best practices, old features refactored as needed.

---

### ADR 4: Zustand Over Redux

**Decision:** Use Zustand for global state management instead of Redux

**Context:**
The frontend needed global state management for:
- Authenticated user information
- Current tenant selection
- User permissions
- UI settings (theme, sidebar state)
- Project-specific state (current project, selected item)

**Rationale:**

**Zustand Benefits:**
- **Extremely lightweight:** ~1KB vs 40KB for Redux + React-Redux
- **Minimal boilerplate:** No actions, reducers, dispatch—just direct state updates
- **Built-in persistence:** Persist middleware for localStorage out-of-the-box
- **No provider required:** Can use anywhere without wrapping components
- **TypeScript support:** Excellent TypeScript integration with type inference
- **Simple API:** Learning curve measured in minutes, not hours
- **Middleware support:** Persist, devtools, immer, etc.

**Why Not Redux:**
- Redux requires significant boilerplate (actions, action creators, reducers, store setup)
- Redux Toolkit reduces boilerplate but still more complex than Zustand
- For small-to-medium apps, Redux's benefits (time-travel debugging, middleware ecosystem) not worth complexity
- Solo developer prioritizes development speed

**Implementation Example:**
```typescript
// Simple store definition
export const useTenantStore = create<TenantState>()(
    persist(
        (set) => ({
            currentTenant: null,
            setCurrentTenant: (tenant) => set({ currentTenant: tenant })
        }),
        { name: 'tenant', getStorage: () => localStorage }
    )
);

// Usage (no provider needed)
const { currentTenant, setCurrentTenant } = useTenantStore();
```

**Alternatives Considered:**

1. **Redux / Redux Toolkit**
   - **Pros:** Industry standard, huge ecosystem, devtools, time-travel debugging
   - **Cons:** Much more boilerplate, larger bundle, overkill for app size
   - **Rejected:** Complexity not justified

2. **React Context API**
   - **Pros:** Built into React, no dependencies
   - **Cons:**
     - No persistence (would need manual localStorage integration)
     - Re-render issues (entire context re-renders on any state change)
     - Provider wrapping complexity
   - **Rejected:** Zustand solves Context's pain points

3. **Jotai / Recoil**
   - **Pros:** Atomic state management, similar simplicity to Zustand
   - **Cons:** Zustand more mature, larger community, better docs
   - **Rejected:** Zustand simpler for this use case

**Trade-offs Accepted:**
- **Smaller ecosystem:** Fewer middleware options than Redux
- **Less tooling:** Redux DevTools more full-featured than Zustand DevTools
- **Less "standard":** Redux more common in job market

**Trade-offs Gained:**
- **Much faster development:** Less boilerplate = faster feature development
- **Smaller bundle:** Better performance for end users
- **Easier onboarding:** New contributors learn Zustand in minutes
- **Built-in persistence:** No additional library needed for localStorage

**Validation:**
After 2+ years with Zustand, no regrets. The stores are simple, maintainable, and performant. The persist middleware works flawlessly for tenant and settings state. If the app grows significantly, migration to Redux would be possible but hasn't been needed.

---

### ADR 5: PrimeReact UI Library

**Decision:** Use PrimeReact as the primary UI component library

**Context:**
The application needed:
- Professional-looking admin dashboard
- DataTable with sorting, filtering, pagination (critical requirement)
- Form components (calendar, dropdown, multi-select, file upload)
- Theming support
- Responsive design

**Rationale:**

**PrimeReact Benefits:**
- **Comprehensive DataTable:** Best-in-class table component with lazy loading, server-side pagination, inline filtering, row selection
- **Complete component set:** 90+ components covering all dashboard needs
- **Theming:** 11 built-in themes, customizable via CSS variables
- **No lock-in:** Can use alongside custom components
- **Active development:** Regular updates, responsive maintainers
- **Good documentation:** Examples for all components
- **PrimeFlex CSS:** Utility-first CSS framework (Tailwind-like) included

**DataTable as Deciding Factor:**
The DataTable component was the primary driver for choosing PrimeReact. Building a comparable table from scratch would take weeks. PrimeReact's DataTable supports:
- Lazy loading with server-side pagination
- Column sorting (single and multi-column)
- Inline filtering per column
- Row selection and bulk operations
- Column reordering and resizing
- Export to CSV/Excel
- Responsive design

**Alternatives Considered:**

1. **Material-UI (MUI)**
   - **Pros:** Very popular, huge community, good design system
   - **Cons:**
     - Heavier bundle size
     - DataGrid component requires paid Pro version for advanced features
     - More opinionated design (Material Design aesthetic)
   - **Rejected:** DataTable gap too large, bundle too heavy

2. **Ant Design**
   - **Pros:** Beautiful components, comprehensive Table component
   - **Cons:**
     - Heavy bundle size
     - More suited to Chinese market aesthetics
     - Less experience with library
   - **Rejected:** PrimeReact more familiar, better docs

3. **Custom Components (Headless UI + Custom CSS)**
   - **Pros:** Complete control, minimal bundle size
   - **Cons:**
     - Weeks/months to build comparable DataTable
     - Maintenance burden falls entirely on team
     - Accessibility concerns
   - **Rejected:** Time constraint, not core differentiator

**Trade-offs Accepted:**
- **Large bundle:** PrimeReact + PrimeIcons + PrimeFlex = ~500KB (gzipped ~150KB)
- **Less customizable:** Component internals not as flexible as headless components
- **Learning curve:** Team must learn PrimeReact API
- **Aesthetic lock-in:** PrimeReact's design language pervades app

**Trade-offs Gained:**
- **Rapid development:** Complex features (DataTable, Calendar, MultiSelect) work out-of-box
- **Professional appearance:** High-quality components without design effort
- **Consistency:** All components follow same design language
- **Time savings:** Months of development time saved vs custom components

**Mitigation Strategies:**
- Use code splitting to load PrimeReact components only on needed pages
- Create thin wrapper components (TextInput, SelectInput) for consistency and future swappability
- Tree-shaking to include only used components

**Validation:**
PrimeReact has proven to be an excellent choice. The DataTable component alone justified the decision—it handles complex lazy loading and filtering that would have taken significant time to build. The theme support has been valuable for future customization.

---

### ADR 6: ULIDs Over Auto-Increment IDs

**Decision:** Use ULIDs (Universally Unique Lexicographically Sortable Identifiers) for all model primary keys instead of auto-increment integers

**Context:**
The application needed globally unique identifiers for:
- Potential distributed systems in future
- Avoiding ID enumeration attacks
- Non-sequential IDs for security
- Sortable IDs for time-based queries

**Rationale:**

**ULID Benefits:**
- **Globally unique:** 128-bit like UUID, no collision risk across systems
- **Sortable:** Lexicographically sortable by timestamp (unlike UUID v4)
- **Compact:** Base32 encoded (26 characters vs 36 for UUID)
- **Timestamp-based:** First 48 bits encode timestamp, useful for debugging
- **Built-in Laravel support:** Laravel 9+ has `HasUlids` trait
- **String type:** Compatible with most databases

**Format:** `01ARZ3NDEKTSV4RRFFQ69G5FAV`
- First 10 characters: timestamp (millisecond precision)
- Last 16 characters: randomness

**Advantages Over Alternatives:**

**vs Auto-Increment Integers:**
- No sequential exposure (can't guess next ID)
- Globally unique (no conflicts in distributed systems)
- Timestamp information embedded
- No central ID generator needed

**vs UUID v4:**
- Sortable (UUIDs are random, not sortable)
- More compact string representation
- Better database index performance (ordered insertion)

**vs Snowflake IDs:**
- No server coordination needed
- Simpler implementation (no datacenter/worker IDs)
- Better for single-instance deployments

**Alternatives Considered:**

1. **Auto-Increment Integers**
   - **Pros:** Smallest storage (8 bytes), fastest queries, most common
   - **Cons:**
     - Sequential exposure (reveals creation order, volume)
     - Not globally unique (conflicts in distributed systems)
     - Enumeration attacks possible
   - **Rejected:** Security and future distributed system concerns

2. **UUID v4 (Random)**
   - **Pros:** Globally unique, well-supported
   - **Cons:**
     - Not sortable (random order)
     - Less efficient database indexing (random insertion)
     - Longer string representation (36 chars)
   - **Rejected:** Lack of sortability problematic

3. **Snowflake IDs**
   - **Pros:** Sortable, efficient, used by Twitter
   - **Cons:**
     - Requires server coordination for worker IDs
     - More complex setup
     - Overkill for single-instance app
   - **Rejected:** Unnecessary complexity

**Implementation:**
```php
// Model
class Livestock extends Model
{
    use HasUlids;  // Laravel built-in trait
}

// Migration
Schema::create('livestock', function (Blueprint $table) {
    $table->ulid('id')->primary();
    // ...
});
```

**Trade-offs Accepted:**
- **Larger index size:** 26 bytes (string) vs 8 bytes (bigint)
- **Slightly slower queries:** String comparison slower than integer
- **Less human-readable:** Hard to remember/communicate IDs
- **Foreign key size:** All FKs also 26 bytes

**Trade-offs Gained:**
- **Better security:** No sequential enumeration
- **Future-proof:** Ready for distributed systems
- **Sortability:** Can order by ID to get chronological order
- **Debuggability:** Timestamp embedded in ID

**Performance Impact:**
Benchmarks show minimal performance difference for databases <1M records. For larger datasets, proper indexing mitigates any slowdown.

**Validation:**
ULIDs have worked well throughout development. The sortability has been useful for debugging (can see creation order). No performance issues encountered with current dataset size (~10K records in test data).

---

### ADR 7: Polymorphic Notes and Service Logs

**Decision:** Implement notes and service logs as polymorphic relationships rather than separate tables per entity

**Context:**
Multiple entities needed notes (livestock, equipment, projects, etc.) and service logs (livestock, equipment). The question was how to model these relationships.

**Rationale:**

**Polymorphic Benefits:**
- **Single table:** One `notes` table serves all entities
- **Single codebase:** One controller, one service, one UI component
- **Extensibility:** New entities get notes/services "for free" by implementing contract
- **Queryability:** Can query all notes across system if needed
- **Consistency:** Same behavior for notes regardless of entity type

**Implementation:**
```php
// Polymorphic table structure
notes:
  - id
  - noteable_type (e.g., "App\Models\Inventory\Livestock")
  - noteable_id (ULID of the entity)
  - content
  - created_by

// Contract
interface Notable {
    public function notes(): MorphMany;
}

// Trait
trait HasNotes {
    public function notes(): MorphMany {
        return $this->morphMany(Note::class, 'noteable');
    }
}

// Usage
class Livestock extends Model implements Notable {
    use HasNotes;
}
```

**Alternatives Considered:**

1. **Separate Tables Per Entity**
   - **Pros:** Slightly faster queries (direct foreign key), clearer schema
   - **Cons:**
     - Schema duplication (livestock_notes, equipment_notes, project_notes, etc.)
     - Code duplication (separate controllers for each)
     - UI duplication (separate components)
     - Hard to implement cross-entity features
   - **Rejected:** Too much duplication

2. **JSON Column on Each Model**
   - **Pros:** No joins, simple structure
   - **Cons:**
     - Not queryable (can't search notes across system)
     - No relationships (can't track created_by)
     - Size limits on JSON columns
     - Hard to enforce schema
   - **Rejected:** Too limiting

3. **NoSQL Document Store for Notes**
   - **Pros:** Flexible schema, good for unstructured data
   - **Cons:**
     - Adds infrastructure complexity (new database)
     - Joins between SQL and NoSQL awkward
     - Overkill for simple text notes
   - **Rejected:** Unjustified complexity

**Trade-offs Accepted:**
- **Slightly slower queries:** Polymorphic queries use WHERE IN (type, id) instead of direct FK
- **Type safety challenges:** `noteable_type` is string, not foreign key
- **Orphan risk:** If entity deleted but notes remain (mitigated by cascade delete)

**Trade-offs Gained:**
- **DRY codebase:** One implementation serves all entities
- **Easy extensibility:** New entities just implement contract and use trait
- **Consistent UX:** Notes work the same everywhere
- **Cross-entity features:** Can search/report on all notes

**Real-World Benefit:**
When project management was added, projects immediately got notes functionality without any additional code—just `use HasNotes` in the model. This validated the decision to use polymorphism.

**Performance Note:**
For databases with millions of notes, polymorphic queries can be slower. Mitigation: add composite index on `(noteable_type, noteable_id)` and consider partitioning by type if needed.

**Validation:**
Polymorphic notes and service logs have proven highly successful. The pattern has been reused for media (Spatie MediaLibrary also uses polymorphism), showing its utility for cross-cutting concerns.

---

## Multi-Tenancy Deep Dive

### Architecture Overview

Openstead's multi-tenancy implementation allows a single application instance to serve multiple independent homesteads/farms with complete data isolation. The architecture is built on three pillars:

1. **Tenant Identification:** HTTP header or query parameter
2. **Automatic Scoping:** Global scopes filter all queries by tenant
3. **Permission Isolation:** Roles and permissions are tenant-specific

### Data Model

**Central Tables (not tenant-scoped):**
- `users` - User accounts, can belong to multiple tenants
- `tenants` - Tenant/homestead records
- `varieties` - Optionally global reference data (breeds, plant types)

**Pivot Table:**
```sql
tenant_users:
  - user_id (FK to users)
  - tenant_id (FK to tenants)
  - roles (JSON array: ["admin", "manager"])
  - permissions (JSON array: ["inventory:create", ...])
  - created_at, updated_at
```

**Tenant-Scoped Tables:**
All domain tables have `tenant_id` column:
- livestock, equipment, seeds, pantry_items
- projects, project_items
- notes, service_logs
- locations

### Request Flow

**1. Frontend Login:**
```javascript
// User logs in
POST /api/login { email, password }

// Response includes user with tenants array
{
  id: "01ARZ...",
  name: "John Doe",
  tenants: [
    { id: "01BRZ...", name: "Smith Farm" },
    { id: "01CRZ...", name: "Jones Ranch" }
  ],
  current_tenant_id: "01BRZ..."
}

// Frontend stores selected tenant
useTenantStore.setState({ currentTenant: tenants[0] });
```

**2. Frontend Request:**
```javascript
// Axios interceptor adds X-Tenant header
axios.get('/api/inventory/livestock');
// Headers: { 'X-Tenant': '01BRZ...' }
```

**3. Backend Middleware:**
```php
// InitializeTenancyByRequestData middleware
$tenantId = $request->header('X-Tenant');

// Verify user has access
if (!$user->tenants->contains('id', $tenantId)) {
    return response()->json(['message' => 'Unauthorized'], 403);
}

// Initialize tenant context
tenancy()->initialize($tenantId);
```

**4. Global Scope Application:**
```php
// BelongsToTenant trait automatically adds WHERE clause
Livestock::all();
// Becomes: SELECT * FROM livestock WHERE tenant_id = '01BRZ...'

// Relationships also scoped
$user->tenants;  // Only tenants user belongs to
```

**5. Response:**
```json
{
  "data": [/* livestock records for tenant 01BRZ... */]
}
```

### Permission System Integration with Tenancy

The permission system is **per-tenant**, not global. This means:

**Same user, different tenants, different permissions:**
```php
// User is Admin in Tenant A
$userInTenantA->roles;  // ['admin']
$userInTenantA->hasPermissionTo(Permission::UserCreate);  // true

// Same user is Viewer in Tenant B
$userInTenantB->roles;  // ['viewer']
$userInTenantB->hasPermissionTo(Permission::UserCreate);  // false
```

**Implementation:**
```php
// User model
public function getRolesAttribute(): Collection
{
    // Get roles for CURRENT tenant only
    return $this->tenants
        ->where('id', $this->currentTenant?->id)
        ->pluck('pivot.roles')
        ->flatten()
        ->map(fn($role) => Role::from($role));
}

public function getAllPermissionsAttribute(): Collection
{
    // Permissions from roles + explicit permissions
    $rolePerms = $this->roles->map(fn($r) => $r->permissions())->flatten();
    $explicitPerms = $this->tenants
        ->where('id', $this->currentTenant?->id)
        ->pluck('pivot.permissions')
        ->flatten();

    return $rolePerms->merge($explicitPerms)->unique();
}
```

### Frontend State Management

**TenantStore (Persisted to localStorage):**
```typescript
export const useTenantStore = create<TenantState>()(
    persist(
        (set) => ({
            currentTenant: null,

            setCurrentTenant: async (tenantId: string) => {
                // Update backend
                await axios.post('/api/user/tenant', { tenant: tenantId });

                // Update local state
                const tenant = user.tenants.find(t => t.id === tenantId);
                set({ currentTenant: tenant });

                // Refresh page (reinitialize tenant context)
                Router.push('/');
            }
        }),
        { name: 'tenant', getStorage: () => localStorage }
    )
);
```

**Why page refresh after tenant switch?**
Tenant context is initialized on request, not dynamically. Refreshing ensures:
- All Zustand stores reinitialize with new tenant context
- All queries refetch data for new tenant
- No stale data from previous tenant

**Could this be improved?** Yes, with more complex state management:
- Clear all React Query caches
- Reinitialize all Zustand stores
- Refetch all active queries
- But page refresh is simpler and more reliable

### Security Considerations

**1. Middleware Validation**
Every request validates user has access to requested tenant:
```php
if (!auth()->user()->tenants->contains('id', $tenantId)) {
    abort(403, 'Unauthorized tenant access');
}
```

**2. Global Scope Protection**
Even if middleware fails, global scopes provide second layer:
```php
// Can't access other tenant's data even if trying
Livestock::where('id', $otherTenantLivestockId)->first();
// Returns null if livestock belongs to different tenant
```

**3. ULID Non-Sequential IDs**
ULIDs prevent tenant ID guessing:
```
01BRZ3NDEKTSV4RRFFQ69G5FAV  (not 1, 2, 3...)
```

**4. File Storage Isolation**
FilesystemTenancyBootstrapper scopes file paths:
```
storage/app/tenants/01BRZ.../media/livestock/image.jpg
```

**5. Cache Isolation**
CacheTenancyBootstrapper prefixes cache keys:
```
Cache::get('livestock_count');
// Becomes: "tenant_01BRZ..._livestock_count"
```

### Known Limitations

**1. No Central Admin Panel**
Currently no way to manage all tenants from one interface. To view all tenants, would need to bypass tenant scope:
```php
Tenant::withoutGlobalScope(TenantScope::class)->get();
```

**Planned Solution:** Separate admin application or special admin routes.

**2. Tenant Switching Requires Page Refresh**
Switching tenants refreshes page to reinitialize context.

**Could Be Improved:** More sophisticated state management to avoid refresh.

**3. JSON Permissions Not Queryable**
Can't query "all users with permission X" across tenants easily.

**Acceptable Trade-off:** Rarely needed, pivot table keeps queries simple.

**4. Noisy Neighbor Problem**
One tenant's heavy load (large imports, exports) could affect others in single-database setup.

**Mitigation:** Resource limits per tenant, job queues, monitoring.

**5. No Tenant-Level Settings**
Currently no tenant-specific configuration (e.g., timezone, currency).

**Planned:** Add `data` JSON column to `tenants` table for settings.

### Future Considerations

**Migration to Multi-Database:**
If scale requires, can migrate to multi-database strategy:
1. Stancl Tenancy supports both strategies
2. Keep central database for users, tenants
3. Create tenant database per tenant
4. Update migrations to run on tenant databases
5. DatabaseTenancyBootstrapper handles database switching

**Tenant Subdomain Support:**
Could add subdomain identification:
1. Add domain column to tenants table
2. Middleware extracts tenant from subdomain
3. Configure wildcard DNS and SSL

**Tenant Customization:**
- Custom themes per tenant
- Tenant-specific branding (logo, colors)
- Tenant-specific modules (enable/disable features)

---

## Permission System Design Philosophy

### RBAC vs ABAC Decision

**Chosen Approach:** Role-Based Access Control (RBAC) with granular permissions

**Philosophy:**
Openstead's permission system balances simplicity with flexibility. The core principle: **Roles are shortcuts for common permission sets, but permissions are the source of truth.**

**Why Not Pure RBAC (Roles Only)?**
Pure RBAC (user has "Admin" role, gets admin access) is too coarse. Real-world scenarios:
- Manager who can't delete users
- Collaborator who can manage projects but not inventory
- Custom roles for specific workflows

**Why Not Pure ABAC (Attribute-Based)?**
ABAC (access based on attributes like department, location, time) is too complex:
- Overkill for current needs
- Harder to reason about
- More difficult to debug

**Hybrid Approach:**
- **Roles** provide convenient permission bundles (Administrator = all permissions)
- **Explicit permissions** allow fine-tuning (Viewer + inventory:create)
- **Per-tenant isolation** ensures same user can have different roles in different tenants

### Permission Structure

**Convention:** `resource:action`

**Resources:**
- inventory
- project, project-item
- user
- note
- service
- tenant

**Actions:**
- list (view collection)
- read (view single item)
- create
- update
- delete

**Examples:**
- `inventory:list` - Can view inventory list
- `inventory:create` - Can create inventory items
- `project:update` - Can update projects
- `user:delete` - Can delete users

**Why This Convention?**
- **Scannable:** Easy to read and understand
- **Consistent:** Same pattern across all resources
- **Extensible:** Easy to add new resources/actions
- **Self-documenting:** Permission name describes what it allows

### Role Hierarchy

**Hierarchy (most → least privileged):**
```
Administrator (all permissions)
  └─ Manager (CRUD everything except users/tenants)
      └─ Collaborator (Create/Update, no Delete)
          └─ Viewer (Read-only)
```

**Domain-Specific Roles:**
```
ProjectManager (full project permissions)
InventoryManager (full inventory permissions)
ProjectCollaborator (project create/update)
InventoryViewer (inventory read-only)
```

**Role Composition (Inheritance):**
Roles inherit permissions via spread operator:
```php
self::Manager => [
    ...self::Collaborator->permissions(),  // Inherits collaborator perms
    Permission::InventoryDelete,           // Adds delete permission
    Permission::ProjectDelete,
    // ...
]
```

**Benefits:**
- **DRY:** No duplicate permission lists
- **Maintainable:** Update Viewer, all higher roles inherit change
- **Clear hierarchy:** Easy to see permission progression

### Middleware Enforcement

**Route-Level Protection:**
```php
Route::post('/inventory/livestock', [LivestockController::class, 'store'])
    ->middleware('user-can:inventory:create');
```

**Why Route-Level vs Policy?**
- **Explicit:** Clear what permission is required at route definition
- **Simple:** No policy files to maintain
- **Scannable:** Grep for 'user-can:' shows all protected routes

**Could Add Policies Later:**
For complex authorization (e.g., "can update if owner or admin"):
```php
$this->authorize('update', $project);

// ProjectPolicy
public function update(User $user, Project $project) {
    return $user->owns($project) || $user->hasPermissionTo(Permission::ProjectUpdate);
}
```

### Frontend Permission Checking

**Two Patterns:**

**1. Declarative (Restrict Component):**
```typescript
<Restrict permission="inventory:create">
    <Button label="Add Livestock" onClick={openForm} />
</Restrict>
```

**2. Imperative (userCan Hook):**
```typescript
const { userCan } = useAuthorizationStore();

if (userCan('inventory:delete')) {
    // Show delete button
}
```

**Why Both?**
- **Declarative** better for UI rendering (cleaner JSX)
- **Imperative** better for logic (conditional behavior)

### Permission Sync Frontend/Backend

**Flow:**
```
1. Backend returns user with permissions array
   GET /api/user
   { id, name, permissions: ["inventory:list", "inventory:create", ...] }

2. Frontend stores in AuthorizationStore
   setPermissions(user.permissions)

3. Frontend checks locally
   userCan("inventory:create")  // O(1) array lookup

4. Backend validates on mutation
   middleware('user-can:inventory:create')
```

**Why Check Both Frontend and Backend?**
- **Frontend:** Better UX (hide unauthorized buttons)
- **Backend:** Security (frontend can be bypassed)

**Never trust frontend checks alone!**

### Design Decisions Rationale

**Enum-Based Permissions:**
```php
enum Permission: string {
    case InventoryCreate = 'inventory:create';
}
```

**Benefits:**
- Type safety (can't typo permission strings)
- IDE autocomplete
- Centralized definition (single source of truth)
- Easy to audit (see all permissions in one file)

**Alternative:** String-based permissions
**Rejected:** Too error-prone, no type safety

**JSON Storage for User Permissions:**
```sql
tenant_users.permissions: ["inventory:create", "custom:permission"]
```

**Benefits:**
- Flexible (can add permissions without schema changes)
- Per-tenant (same user, different permissions in different tenants)
- Fast to query (single column)

**Drawbacks:**
- Not queryable (can't easily find "all users with permission X")
- Size limits on JSON columns

**Acceptable:** Rare to query by permission, per-user queries fast

**Middleware vs Policy:**

**Why Middleware:**
- Simpler (no policy files)
- Explicit at route level
- Easier to debug (clear error messages)

**When to Use Policies:**
- Complex logic (ownership checks, conditional access)
- Resource-specific rules (e.g., "can edit own projects")

**Current Approach:** Middleware for simple permission checks, policies could be added for complex cases

### Evolution and Lessons Learned

**V1 (Early 2022):** Simple roles (Admin, User)
- Too coarse, couldn't grant partial access

**V2 (Mid 2023):** Granular permissions (inventory:create, project:update)
- Better, but managing permissions per user tedious

**V3 (Late 2023):** Roles with permission bundles
- Best of both worlds
- Roles for common cases, explicit permissions for edge cases

**V4 (Current):** Per-tenant roles/permissions
- Multi-tenancy required tenant-specific authorization
- Same user can be admin in one farm, viewer in another

**Lesson:** Start simple, add complexity as needed. Early over-engineering (ABAC) would have wasted time.

---

## Technology Choices & Rationale

*(Due to length, I'll continue in the next message)*

---

**End of Part 1 of RESEARCH.md**
