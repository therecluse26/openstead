# CLAUDE.md - AI Agent Quick Reference

**Last Updated:** 2026-02-12
**Version:** 1.0 (Multi-tenancy)
**For detailed rationale and history, see `research/RESEARCH.md`**

---

## Project Essentials

**Openstead** - Open-source homestead/farm management platform

**Features:** Inventory (livestock w/genealogy, seeds, equipment, pantry), project management (Kanban), service logs, notes, multi-tenancy, RBAC

**Architecture:** Monorepo, Laravel 10 API + Next.js 13 SPA, single-DB multi-tenancy (Stancl), ULID primary keys

---

## Tech Stack

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Backend** | Laravel | 10.x | API-only |
| | PHP | 8.1+ | Requires enums |
| | MySQL | 8.0 | Single shared DB |
| | Redis | Latest | Cache/queues |
| | Sanctum | 3.2+ | SPA auth |
| | Stancl Tenancy | 3.7+ | Single-DB multi-tenancy |
| | Spatie MediaLibrary | 10.0+ | Polymorphic media |
| | MinIO | Latest | S3-compatible local storage |
| **Frontend** | Next.js | 13.x | Pages Router (NOT App Router) |
| | React | 18.2+ | |
| | Zustand | 4.3+ | State + persistence |
| | PrimeReact | 8.5+ | UI components |
| | React Hook Form | 7.35+ | Forms |
| | SWR | 1.2+ | Auth user |
| | React Query | 4.32+ | Server state |
| | Axios | 0.21+ | HTTP |
| **Infra** | Docker Compose | Latest | Local dev |
| | Railway | N/A | Production |
| | Alpine Linux | Latest | Container base |

---

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env  # Edit: DB_HOST=mysql, FILESYSTEM_DISK=s3
docker-compose up -d
docker exec -it openstead-api /bin/ash
composer install && php artisan key:generate && php artisan migrate --seed
exit

# Frontend
cd frontend
cp .env.example .env.local  # Edit: NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
npm install && npm run dev

# Access: http://localhost:3000
```

---

## Directory Structure (Abbreviated)

```
backend/app/
  Contracts/          # Interfaces (Inventoriable, Notable, Serviceable, Repository)
  Enums/              # PHP 8.1 enums (Permission, Role, types)
    Authorization/    # Permission.php, Role.php (resource:action pattern)
  Http/
    Controllers/      # Thin, delegate to services
    Middleware/       # UserCan.php, InitializeTenancyByRequestData.php
    Resources/        # List/ (minimal), Detail/ (full w/ relations)
  Models/             # Eloquent (use HasUlids, BelongsToTenant, traits)
    Inventory/, Projects/, User.php, Tenant.php, TenantUser.php
  Repositories/       # Data access (polymorphic, accept contracts)
  Services/           # Business logic, DataTableService.php (PrimeReact integration)
  Traits/             # HasNotes, HasImages, HasServiceLogs, HasInventory, BelongsToTenant

frontend/src/
  components/
    Authorization/    # AuthorizationStore.ts, Restrict.tsx
    HookFormInputs/   # TextInput.js, etc. (Controller wrappers)
    Tenants/          # TenantStore.ts (persisted)
    Settings/         # SettingStore.ts (persisted)
  forms/              # LivestockForm.js, etc. (useForm + custom inputs)
  hooks/              # auth.js (useAuth from Breeze)
  lib/                # axios.js (X-Tenant interceptor)
  pages/              # Next.js Pages Router
    _app.js           # Providers, auth middleware
  services/           # API calls (LivestockService.js, etc.)
  state/              # ProjectStore.ts
```

---

## Core Patterns

### 1. Repository Pattern
```php
// Contract
interface Repository { public function all(): Collection; /* ... */ }

// Implementation (polymorphic)
class InventoryRepository implements Repository {
    public function __construct(Inventoriable|Model $model) { $this->model = $model; }
}

// Usage
$repo = new InventoryRepository(new Livestock());
$all = $repo->all();
```

### 2. Polymorphic Relationships
```php
// Note.php
public function noteable(): MorphTo { return $this->morphTo(); }

// HasNotes trait
public function notes(): MorphMany { return $this->morphMany(Note::class, 'noteable'); }

// Model
class Livestock extends Model implements Notable {
    use HasNotes;  // Gets notes() relationship for free
}
```

### 3. Trait Composition
```php
class Livestock extends Model implements Inventoriable, Notable, HasMedia {
    use HasUlids, HasInventory, HasNotes, HasImages, BelongsToTenant, SoftDeletes;
}
```

### 4. Enum-Based Permissions
```php
enum Permission: string {
    case InventoryCreate = 'inventory:create';  // Pattern: resource:action
}

enum Role: string {
    case Administrator = 'admin';
    public function permissions(): array {
        return match($this) {
            self::Administrator => Permission::cases(),  // All
            self::Manager => [/* specific permissions */],
        };
    }
}
```

---

## Multi-Tenancy (Critical)

**Strategy:** Single-DB, tenant_id column, Stancl Tenancy

**Key Files:**
- `backend/config/tenancy.php` - Disabled DatabaseBootstrapper
- `backend/app/Http/Middleware/InitializeTenancyByRequestData.php` - Tenant from X-Tenant header
- `backend/app/Traits/BelongsToTenant.php` - Auto-scopes queries
- `frontend/src/components/Tenants/TenantStore.ts` - Persisted tenant state
- `frontend/src/lib/axios.js` - Adds X-Tenant header

**Flow:**
1. Frontend sends `X-Tenant: <tenant_id>` header (axios interceptor)
2. Middleware validates user belongs to tenant, initializes context
3. BelongsToTenant trait auto-adds `WHERE tenant_id = ?` to all queries
4. Responses scoped to tenant

**User-Tenant Relationship:**
- Many-to-many via `tenant_users` pivot
- Pivot stores `roles` (JSON), `permissions` (JSON) per user per tenant
- Same user can be Admin in Tenant A, Viewer in Tenant B

**Gotcha:** Tenant switch requires page refresh (TenantStore.setCurrentTenant calls Router.push('/'))

---

## Auth & Authorization

**Auth:** Laravel Sanctum (SPA token), frontend useAuth hook (Breeze)

**Permissions:**
- Format: `resource:action` (e.g., `inventory:create`, `project:update`)
- Defined in `backend/app/Enums/Authorization/Permission.php`
- Routes protected via `middleware('user-can:permission:name')`
- Frontend checks via `useAuthorizationStore().userCan(permission)` + `<Restrict>` component

**Critical:**
```php
// Backend route protection
Route::post('/livestock', [LivestockController::class, 'store'])
    ->middleware('user-can:inventory:create');

// Frontend UI gating
<Restrict permission="inventory:create">
    <Button label="Add" onClick={openForm} />
</Restrict>
```

---

## Database Schema (Key Tables)

**Central (not tenant-scoped):**
- `users`, `tenants`, `tenant_users` (pivot: roles/permissions JSON)

**Tenant-scoped (all have tenant_id):**
- `livestock`, `equipment`, `seeds`, `pantry_items`
- `projects`, `project_items`, `project_item_statuses`
- `notes` (polymorphic: noteable_type/id)
- `service_logs` (polymorphic: serviceable_type/id)
- `media` (Spatie: model_type/id)
- `locations`, `varieties`, `services`

**Patterns:**
- ULIDs for all PKs (`use HasUlids`)
- `tenant_id` indexed on all tenant-scoped tables
- Soft deletes (`use SoftDeletes`)
- JSON columns for flexibility (workflow_statuses, roles, permissions)

---

## API Routing Pattern

```php
// backend/routes/api.php
Route::middleware([InitializeTenancyByRequestData::class])->group(function() {
    Route::middleware(['auth:sanctum'])->group(function() {
        Route::prefix('/inventory/livestock')->group(
            base_path('routes/inventory/livestock-routes.php')  // Modular routes
        );
    });
});

// livestock-routes.php
Route::get('/', [LivestockController::class, 'index'])->middleware('user-can:inventory:list');
Route::post('/', [LivestockController::class, 'store'])->middleware('user-can:inventory:create');
// ... standard CRUD
```

**Frontend Service:**
```javascript
class LivestockService {
    static async getAll(params) { return axios.get('/api/inventory/livestock', { params }); }
    static async create(data) { return axios.post('/api/inventory/livestock', data); }
    static async update(id, data) { return axios.post(`/api/inventory/livestock/${id}`, { ...data, _method: 'PUT' }); }
}
```

---

## Frontend State (Zustand)

**Stores:**
1. **TenantStore** (persisted) - `currentTenant`, `setCurrentTenant()`
2. **AuthorizationStore** - `user`, `permissions`, `userCan()`
3. **SettingStore** (persisted) - `theme`, `sidebarMenuActive`
4. **ProjectStore** - `project`, `selectedItem`, `modalVisible`

**Pattern:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTenantStore = create<TenantState>()(
    persist(
        (set) => ({ currentTenant: null, setCurrentTenant: (t) => set({ currentTenant: t }) }),
        { name: 'tenant', getStorage: () => localStorage }
    )
);
```

---

## Forms (React Hook Form + PrimeReact)

**Pattern:**
```javascript
const LivestockForm = ({ mode, id }) => {
    const { control, handleSubmit, setValue } = useForm({ defaultValues });
    const [uploadedImages, setUploadedImages] = useState([]);

    const onSubmit = async (data) => {
        const images = await convertUploadedFilesToBase64(uploadedImages);
        const payload = { ...data, images };
        mode === 'create'
            ? await LivestockService.create(payload)
            : await LivestockService.update(id, payload);
        router.push('/inventory/livestock');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput name="name" control={control} rules={{ required: 'Required' }} />
            <SelectInput name="sex" control={control} options={sexOptions} />
            <FileUpload onSelect={e => setUploadedImages(e.files)} />
            <Button type="submit" />
        </form>
    );
};
```

**Custom Input Wrapper:**
```javascript
const TextInput = ({ name, control, label, rules, ...props }) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
            <div className="field">
                <label>{label}</label>
                <InputText {...field} {...props} className={classNames({ 'p-invalid': fieldState.error })} />
                {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
            </div>
        )}
    />
);
```

---

## Common Tasks

### Add New Inventory Type
1. Create enum: `backend/app/Enums/MyType.php` (use FilterableEnum trait)
2. Create model: `backend/app/Models/Inventory/MyInventory.php` (implements Inventoriable, use HasInventory, BelongsToTenant)
3. Migration: `$table->ulid('id')->primary(); $table->string('tenant_id')->index();`
4. Create repository: `new InventoryRepository(new MyInventory())`
5. Controller: inject repository, use DataTableService
6. Routes: `routes/inventory/my-inventory-routes.php`, register in `api.php`
7. Frontend: Service, Form, Pages (follow existing patterns)

### Add New Permission
1. Add to `Permission` enum: `case MyResourceCreate = 'my-resource:create';`
2. Add to `Role` permissions: `self::Manager => [..., Permission::MyResourceCreate]`
3. Protect route: `->middleware('user-can:my-resource:create')`
4. Frontend: `<Restrict permission="my-resource:create">...</Restrict>`

---

## Environment Variables

**Backend (.env):**
```bash
APP_ENV=local|production
APP_KEY=base64:...  # php artisan key:generate
DB_CONNECTION=mysql
DB_HOST=mysql  # Docker service name
DB_DATABASE=openstead
FILESYSTEM_DISK=s3
AWS_ENDPOINT=http://minio:9000
AWS_BUCKET=media
FRONTEND_URL=http://localhost:3000  # CORS
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # No trailing slash
```

---

## Key Gotchas

- **Multi-tenancy:** Always include X-Tenant header, new models must use BelongsToTenant
- **Auth:** Call csrf() before login/register, use localhost (not 127.0.0.1)
- **Images:** Must be base64 encoded (convertUploadedFilesToBase64)
- **IDs:** ULIDs (strings), not integers
- **Routing:** Pages Router (not App Router)
- **Docker:** Alpine uses ash shell (not bash), MySQL on port 33062
- **Tenant Switch:** Page refresh required (Router.push('/'))

---

## Critical Files

**Backend:**
- `routes/api.php` - Route structure
- `app/Http/Middleware/InitializeTenancyByRequestData.php` - Tenant resolution
- `app/Services/DataTableService.php` - PrimeReact integration
- `app/Models/User.php` - User with tenant relationships
- `app/Enums/Authorization/Permission.php` - All permissions
- `config/tenancy.php` - Multi-tenancy config

**Frontend:**
- `src/hooks/auth.js` - useAuth hook
- `src/components/Tenants/TenantStore.ts` - Tenant state
- `src/components/Authorization/AuthorizationStore.ts` - Permissions
- `src/lib/axios.js` - X-Tenant interceptor
- `src/pages/_app.js` - App wrapper

---

## Commands

```bash
# Backend
docker exec -it openstead-api /bin/ash
php artisan migrate
php artisan db:seed --class=TestDataSeeder
./vendor/bin/pint  # Format
./vendor/bin/phpstan analyse  # Static analysis

# Frontend
npm run dev
npm run build
npx prettier --write .
```

---

**For architectural decisions, design philosophy, and detailed explanations, see `RESEARCH.md`**
