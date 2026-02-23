# Issue #16: Feature Flags

**Priority:** 🔵 LOW (Foundation for Future Features)
**Complexity:** Medium
**Estimated Time:** 6-10 hours
**Status:** Not Started

## Overview

Implement a feature flag system to control access to features based on billing tiers, enable gradual rollouts, and support A/B testing. This system will be foundational for Issue #17 (Billing/Subscriptions) and future feature development.

## Use Cases

1. **Billing Tier Restrictions** - Pro-only features (advanced analytics, API access, etc.)
2. **Gradual Feature Rollout** - Enable features for subset of users first
3. **A/B Testing** - Test different UX/features with different user groups
4. **Feature Toggle** - Quickly disable problematic features in production
5. **Beta Features** - Allow opt-in to experimental features
6. **Tenant-Specific Features** - Enable custom features for specific tenants

## Technology Options

### Option A: Laravel Pennant (Recommended)
- Official Laravel package for feature flags
- Built-in support for user/tenant scoping
- Database or in-memory storage
- Simple API: `Feature::active('api-access')`

### Option B: Custom Implementation
- Full control over logic
- More development time
- Maintenance burden

### Option C: External Service (LaunchDarkly, Flagsmith)
- Enterprise features (advanced targeting, analytics)
- Additional cost
- External dependency

**Decision:** Use Laravel Pennant (official, simple, free)

## Implementation Plan

### Phase 1: Install Laravel Pennant

- [ ] Install package: `composer require laravel/pennant`
- [ ] Publish configuration: `php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"`
- [ ] Run migrations: `php artisan migrate` (creates `features` table)
- [ ] Review config: `/backend/config/pennant.php`

### Phase 2: Define Feature Flags

- [ ] Create feature class: `/backend/app/Features/Feature.php`
  - [ ] Define all feature flags as constants
  - [ ] Group by category (billing, experimental, module-specific)

**Example Feature Class:**
```php
namespace App\Features;

class Feature
{
    // Billing Tier Features
    const API_ACCESS = 'api-access';
    const ADVANCED_ANALYTICS = 'advanced-analytics';
    const CUSTOM_BRANDING = 'custom-branding';
    const UNLIMITED_PROJECTS = 'unlimited-projects';

    // Module Features
    const CALENDAR_MODULE = 'calendar-module';
    const PLANT_DATABASE = 'plant-database';
    const MARKETPLACE = 'marketplace';

    // Experimental Features
    const NEW_DASHBOARD = 'new-dashboard';
    const AI_INSIGHTS = 'ai-insights';

    // Beta Features
    const MOBILE_APP_SYNC = 'mobile-app-sync';
}
```

- [ ] Create feature resolver: `/backend/app/Providers/FeatureFlagServiceProvider.php`
  - [ ] Define feature resolution logic
  - [ ] Check user billing tier
  - [ ] Check tenant settings
  - [ ] Check beta opt-in flags

**Example Service Provider:**
```php
use Laravel\Pennant\Feature as PennantFeature;
use App\Features\Feature;

class FeatureFlagServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Billing tier features
        PennantFeature::define(Feature::API_ACCESS, function (User $user) {
            return $user->currentTenant()?->subscription_tier === 'pro';
        });

        PennantFeature::define(Feature::ADVANCED_ANALYTICS, function (User $user) {
            return in_array($user->currentTenant()?->subscription_tier, ['pro', 'enterprise']);
        });

        // Module features (tenant-level configuration)
        PennantFeature::define(Feature::CALENDAR_MODULE, function (User $user) {
            return $user->currentTenant()?->enabled_modules['calendar'] ?? false;
        });

        // Beta features (user opt-in)
        PennantFeature::define(Feature::NEW_DASHBOARD, function (User $user) {
            return $user->beta_features['new_dashboard'] ?? false;
        });

        // Always enabled features (for gradual rollout)
        PennantFeature::define(Feature::PLANT_DATABASE, fn() => true);
    }
}
```

- [ ] Register provider in `/backend/config/app.php`:
  ```php
  'providers' => [
      // ...
      App\Providers\FeatureFlagServiceProvider::class,
  ],
  ```

### Phase 3: Database Schema Updates

- [ ] Add fields to `tenants` table (migration: `add_feature_fields_to_tenants_table`):
  - [ ] `subscription_tier` (enum: 'free', 'pro', 'enterprise', default 'free')
  - [ ] `enabled_modules` (JSON, default '{}') - Tenant-specific module toggles
  - [ ] `feature_limits` (JSON, default '{}') - Tier-based limits (e.g., max_projects: 10)

- [ ] Add fields to `users` table (migration: `add_beta_features_to_users_table`):
  - [ ] `beta_features` (JSON, default '{}') - User opt-in to beta features

- [ ] Update `Tenant` model:
  - [ ] Cast `enabled_modules`, `feature_limits` as `array`
  - [ ] Cast `subscription_tier` as enum

- [ ] Update `User` model:
  - [ ] Cast `beta_features` as `array`

### Phase 4: Backend API - Feature Flag Checks

- [ ] Create middleware: `/backend/app/Http/Middleware/RequireFeature.php`
  - [ ] Check if feature is enabled for user
  - [ ] Return 403 Forbidden if not enabled
  - [ ] Usage: `->middleware('feature:api-access')`

**Middleware Implementation:**
```php
use Laravel\Pennant\Feature as PennantFeature;

class RequireFeature
{
    public function handle(Request $request, Closure $next, string $feature)
    {
        if (!PennantFeature::active($feature)) {
            return response()->json([
                'message' => 'This feature is not available on your plan.',
                'feature' => $feature,
                'upgrade_required' => true,
            ], 403);
        }

        return $next($request);
    }
}
```

- [ ] Register middleware in `/backend/app/Http/Kernel.php`:
  ```php
  protected $routeMiddleware = [
      // ...
      'feature' => \App\Http\Middleware\RequireFeature::class,
  ];
  ```

- [ ] Create API endpoint: `/backend/app/Http/Controllers/Features/FeatureController.php`
  - [ ] `index()` - Get all active features for current user
  - [ ] `check($featureName)` - Check if specific feature is active

**Controller:**
```php
class FeatureController extends Controller
{
    public function index(Request $request)
    {
        $features = [
            Feature::API_ACCESS => Feature::active(Feature::API_ACCESS),
            Feature::ADVANCED_ANALYTICS => Feature::active(Feature::ADVANCED_ANALYTICS),
            Feature::CALENDAR_MODULE => Feature::active(Feature::CALENDAR_MODULE),
            // ... all features
        ];

        return response()->json(['features' => $features]);
    }

    public function check(Request $request, string $feature)
    {
        return response()->json([
            'feature' => $feature,
            'active' => Feature::active($feature),
        ]);
    }
}
```

- [ ] Create routes: `/backend/routes/features/feature-routes.php`
  ```php
  Route::get('/', [FeatureController::class, 'index']);
  Route::get('/{feature}', [FeatureController::class, 'check']);
  ```

- [ ] Register in `/backend/routes/api.php`:
  ```php
  Route::prefix('/features')->middleware(['auth:sanctum', InitializeTenancyByRequestData::class])
      ->group(base_path('routes/features/feature-routes.php'));
  ```

### Phase 5: Protect Backend Routes with Feature Flags

- [ ] Example: Protect API access routes
  ```php
  Route::prefix('/api/v1')->middleware('feature:api-access')->group(function() {
      // API endpoints only accessible with api-access feature
  });
  ```

- [ ] Example: Protect calendar routes (when calendar is built)
  ```php
  Route::prefix('/calendar')->middleware('feature:calendar-module')->group(
      base_path('routes/calendar/calendar-event-routes.php')
  );
  ```

### Phase 6: Frontend Feature Flag State

- [ ] Create store: `/frontend/src/components/Features/FeatureFlagStore.ts`
  ```typescript
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  interface FeatureFlagState {
      features: Record<string, boolean>;
      loadFeatures: () => Promise<void>;
      isActive: (featureName: string) => boolean;
      refresh: () => Promise<void>;
  }

  export const useFeatureFlagStore = create<FeatureFlagState>()(
      persist(
          (set, get) => ({
              features: {},

              loadFeatures: async () => {
                  const response = await axios.get('/api/features');
                  set({ features: response.data.features });
              },

              isActive: (featureName: string) => {
                  return get().features[featureName] ?? false;
              },

              refresh: async () => {
                  await get().loadFeatures();
              },
          }),
          {
              name: 'feature-flags',
              getStorage: () => sessionStorage, // Refresh each session
          }
      )
  );
  ```

- [ ] Load features in app initialization (`/frontend/src/pages/_app.js`):
  ```jsx
  useEffect(() => {
      if (user) {
          useFeatureFlagStore.getState().loadFeatures();
      }
  }, [user]);
  ```

### Phase 7: Frontend Feature Gating Components

- [ ] Create component: `/frontend/src/components/Features/FeatureGate.tsx`
  ```tsx
  import { useFeatureFlagStore } from './FeatureFlagStore';

  interface FeatureGateProps {
      feature: string;
      children: React.ReactNode;
      fallback?: React.ReactNode;
  }

  export const FeatureGate: React.FC<FeatureGateProps> = ({
      feature,
      children,
      fallback = null
  }) => {
      const isActive = useFeatureFlagStore(state => state.isActive(feature));

      if (!isActive) {
          return <>{fallback}</>;
      }

      return <>{children}</>;
  };
  ```

- [ ] Create hook: `/frontend/src/hooks/useFeature.ts`
  ```typescript
  import { useFeatureFlagStore } from '../components/Features/FeatureFlagStore';

  export const useFeature = (featureName: string): boolean => {
      return useFeatureFlagStore(state => state.isActive(featureName));
  };
  ```

### Phase 8: Frontend Feature Gating Usage

- [ ] Gate UI elements with `<FeatureGate>`:
  ```jsx
  import { FeatureGate } from '@/components/Features/FeatureGate';

  <FeatureGate feature="advanced-analytics">
      <Button label="Advanced Reports" onClick={openAdvancedReports} />
  </FeatureGate>

  <FeatureGate
      feature="api-access"
      fallback={<UpgradePrompt feature="API Access" />}
  >
      <APIKeysPanel />
  </FeatureGate>
  ```

- [ ] Use hook for conditional logic:
  ```jsx
  const hasCalendar = useFeature('calendar-module');

  return (
      <Menu>
          <MenuItem label="Dashboard" />
          <MenuItem label="Inventory" />
          {hasCalendar && <MenuItem label="Calendar" />}
      </Menu>
  );
  ```

### Phase 9: Admin UI - Feature Management

- [ ] Create page: `/frontend/src/pages/settings/features.js` (Admin only)
  - [ ] Display current subscription tier
  - [ ] Show all available features with status (enabled/disabled)
  - [ ] Show tier-based limits (max projects, max users, etc.)
  - [ ] Button to upgrade plan (links to billing page)
  - [ ] Beta features opt-in toggles

- [ ] Create component: `/frontend/src/components/Features/FeatureList.js`
  - [ ] DataTable showing all features
  - [ ] Columns: Feature Name, Description, Status, Required Tier
  - [ ] Visual indicator: ✅ Enabled | 🔒 Locked | 🧪 Beta

- [ ] Create API endpoint for user beta opt-in:
  - [ ] `POST /api/users/beta-features` - Enable/disable beta feature for user
  - [ ] Update `user.beta_features` JSON field

### Phase 10: Upgrade Prompts

- [ ] Create component: `/frontend/src/components/Features/UpgradePrompt.tsx`
  - [ ] Display when user tries to access locked feature
  - [ ] Show feature benefits
  - [ ] "Upgrade to Pro" button
  - [ ] Link to pricing page or contact sales

**Example:**
```tsx
interface UpgradePromptProps {
    feature: string;
    requiredTier?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
    feature,
    requiredTier = 'Pro'
}) => {
    return (
        <Card>
            <div className="text-center p-4">
                <i className="pi pi-lock" style={{ fontSize: '3rem', color: '#ccc' }} />
                <h3>{feature} is a {requiredTier} feature</h3>
                <p>Upgrade your plan to unlock this feature and more.</p>
                <Button label="Upgrade Now" onClick={() => router.push('/billing')} />
            </div>
        </Card>
    );
};
```

### Phase 11: Testing

- [ ] Backend Testing
  - [ ] Test feature flag resolution for different subscription tiers
  - [ ] Test middleware blocks access when feature disabled
  - [ ] Test API returns correct active features for user
  - [ ] Test tenant-level module toggles
  - [ ] Test user-level beta opt-ins
  - [ ] Test multi-tenant isolation (features scoped to tenant)

- [ ] Frontend Testing
  - [ ] Test FeatureGate shows/hides content correctly
  - [ ] Test useFeature hook returns correct status
  - [ ] Test feature list displays all features with status
  - [ ] Test upgrade prompt appears for locked features
  - [ ] Test beta opt-in toggles update user settings

- [ ] Integration Testing
  - [ ] Free tier user tries to access Pro feature → Blocked with upgrade prompt
  - [ ] Admin enables beta feature → Feature becomes available
  - [ ] Tenant upgrades to Pro → Pro features unlock
  - [ ] Feature flag changes reflect in UI without refresh (state management)

## Critical Files

### Backend Files to Create:
- `/backend/app/Features/Feature.php` - Feature flag constants
- `/backend/app/Providers/FeatureFlagServiceProvider.php` - Feature resolution logic
- `/backend/app/Http/Middleware/RequireFeature.php` - Route protection
- `/backend/app/Http/Controllers/Features/FeatureController.php` - API endpoints
- `/backend/routes/features/feature-routes.php` - Routes
- Migrations: Add subscription_tier, enabled_modules, beta_features fields

### Backend Files to Modify:
- `/backend/config/app.php` - Register FeatureFlagServiceProvider
- `/backend/app/Http/Kernel.php` - Register RequireFeature middleware
- `/backend/app/Models/Tenant.php` - Cast new JSON fields
- `/backend/app/Models/User.php` - Cast beta_features field
- `/backend/routes/api.php` - Register feature routes

### Frontend Files to Create:
- `/frontend/src/components/Features/FeatureFlagStore.ts` - Feature flag state
- `/frontend/src/components/Features/FeatureGate.tsx` - Gating component
- `/frontend/src/components/Features/UpgradePrompt.tsx` - Upgrade CTA
- `/frontend/src/components/Features/FeatureList.js` - Feature list display
- `/frontend/src/hooks/useFeature.ts` - Feature check hook
- `/frontend/src/pages/settings/features.js` - Feature management page

### Frontend Files to Modify:
- `/frontend/src/pages/_app.js` - Load features on app init
- Navigation menus - Gate menu items by features
- Various pages - Add FeatureGate around premium features

## Verification Checklist

- [ ] Laravel Pennant installed and configured
- [ ] Feature flags defined in Feature class
- [ ] Feature resolution logic works for different tiers
- [ ] Middleware blocks unauthorized access to protected routes
- [ ] API endpoint returns correct active features
- [ ] Frontend FeatureFlagStore loads and caches features
- [ ] FeatureGate component shows/hides content correctly
- [ ] useFeature hook works in components
- [ ] Upgrade prompts display for locked features
- [ ] Admin can view feature status in settings
- [ ] Beta opt-in toggles work
- [ ] Feature flags respect multi-tenancy
- [ ] All tests pass

## Success Criteria

✅ **Complete when:**
1. Feature flag system operational with Laravel Pennant
2. Features can be toggled based on subscription tier
3. Frontend UI gates features appropriately
4. Upgrade prompts guide users to billing
5. Beta features can be opted into
6. Admin can manage feature availability
7. All tests pass
8. Documentation updated

## Future Enhancements

- A/B testing framework (track variant assignment, measure outcomes)
- Feature flag analytics (usage tracking, conversion metrics)
- Gradual rollout percentages (enable for 10% of users, then 50%, then 100%)
- Feature flag UI for non-technical admins (toggle features without code deploy)
- Scheduled feature activation (enable feature at specific date/time)

## Next Steps After Completion

- Close Issue #16 on GitHub
- Move to Issue #17 (Billing/Subscriptions) - depends on feature flags
- Start using feature flags for new feature rollouts
- Define subscription tiers and feature matrix

## Notes

- Feature flags are foundational for billing (Issue #17)
- Laravel Pennant is simple and powerful for this use case
- Consider starting with basic tier system (Free vs. Pro) before adding more complexity
- Feature flags improve deployment safety (can disable features without code rollback)
- Beta features help gather feedback before full release
- Keep feature flag logic simple initially, add complexity as needed
