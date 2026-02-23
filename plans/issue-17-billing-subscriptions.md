# Issue #17: Billing/Subscriptions

**Priority:** 🔵 LOW (Business Model Feature)
**Complexity:** Hard
**Estimated Time:** 20-30 hours
**Status:** Not Started
**Dependencies:** Issue #16 (Feature Flags) must be completed first

## Overview

Implement a freemium billing model with subscription tiers and payment processing. This will enable monetization of the Openstead platform while providing a free tier for basic users. Feature flags (Issue #16) will enforce paywall restrictions.

## Business Model (Suggested - Requires Decision)

### Freemium Tiers

**Free Tier:**
- 1 tenant (homestead/farm)
- 3 users per tenant
- 5 projects maximum
- Basic inventory management
- Core features only
- Community support

**Pro Tier ($10-15/month):**
- 1 tenant
- Unlimited users
- Unlimited projects
- Advanced analytics
- Calendar module
- Plant database access
- Priority support
- Custom branding (logo, colors)

**Enterprise Tier ($50-100/month):**
- Multiple tenants (or higher limits)
- API access
- Custom integrations
- Dedicated support
- White-label options
- Advanced reporting

**NOTE:** Pricing and feature matrix need product/business decisions before implementation.

## Technology Stack

### Payment Processor Options

**Option A: Stripe (Recommended)**
- Industry standard, trusted
- Laravel Cashier integration (official package)
- Supports subscriptions, one-time payments, invoices
- Excellent documentation
- Webhook support for payment events
- PCI compliance handled by Stripe

**Option B: Paddle**
- Merchant of record (handles taxes, VAT)
- Higher fees but simplifies compliance
- Good for SaaS products
- Laravel Cashier integration available

**Option C: PayPal**
- Widely recognized
- Higher friction for users
- Less elegant subscription management

**Decision:** Use Stripe with Laravel Cashier

## Implementation Plan

### Phase 1: Install Laravel Cashier (Stripe)

- [ ] Install package: `composer require laravel/cashier`
- [ ] Publish configuration: `php artisan vendor:publish --tag="cashier-config"`
- [ ] Publish migrations: `php artisan vendor:publish --tag="cashier-migrations"`
- [ ] Run migrations: `php artisan migrate` (creates `subscriptions`, `subscription_items` tables)
- [ ] Configure Stripe keys in `.env`:
  ```env
  STRIPE_KEY=pk_test_...
  STRIPE_SECRET=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

### Phase 2: Update Models for Billing

- [ ] Update `Tenant` model (billable entity):
  - [ ] Add `use Billable` trait from Laravel\Cashier
  - [ ] Cashier expects these fields (already in migration):
    - `stripe_id` - Stripe customer ID
    - `pm_type` - Payment method type
    - `pm_last_four` - Last 4 digits of card
    - `trial_ends_at` - Trial expiration date
  - [ ] Add relationship to subscriptions

**Update Tenant Model:**
```php
use Laravel\Cashier\Billable;

class Tenant extends BaseTenant
{
    use Billable, HasDatabase;

    // Cashier will add stripe_id, pm_type, pm_last_four, trial_ends_at
}
```

- [ ] Create migration: `add_billing_fields_to_tenants_table` (if not in Cashier migrations)
  - [ ] `stripe_id` (string, nullable, indexed)
  - [ ] `pm_type` (string, nullable)
  - [ ] `pm_last_four` (string, nullable)
  - [ ] `trial_ends_at` (timestamp, nullable)

### Phase 3: Define Subscription Plans in Stripe

- [ ] Log in to Stripe Dashboard
- [ ] Create Products:
  - [ ] Product: "Openstead Pro" → Price: $10/month (recurring)
  - [ ] Product: "Openstead Enterprise" → Price: $50/month (recurring)
- [ ] Note Price IDs (e.g., `price_1234abcd...`)
- [ ] Store Price IDs in config or database

- [ ] Create config file: `/backend/config/subscriptions.php`
  ```php
  return [
      'plans' => [
          'free' => [
              'name' => 'Free',
              'stripe_price_id' => null,
              'features' => [
                  'max_users' => 3,
                  'max_projects' => 5,
                  'calendar_module' => false,
                  'api_access' => false,
                  'advanced_analytics' => false,
              ],
          ],
          'pro' => [
              'name' => 'Pro',
              'stripe_price_id' => env('STRIPE_PRICE_PRO', 'price_...'),
              'price' => 10.00,
              'features' => [
                  'max_users' => null, // unlimited
                  'max_projects' => null,
                  'calendar_module' => true,
                  'api_access' => false,
                  'advanced_analytics' => true,
              ],
          ],
          'enterprise' => [
              'name' => 'Enterprise',
              'stripe_price_id' => env('STRIPE_PRICE_ENTERPRISE', 'price_...'),
              'price' => 50.00,
              'features' => [
                  'max_users' => null,
                  'max_projects' => null,
                  'calendar_module' => true,
                  'api_access' => true,
                  'advanced_analytics' => true,
              ],
          ],
      ],
  ];
  ```

### Phase 4: Backend API - Subscription Management

- [ ] Create controller: `/backend/app/Http/Controllers/Billing/SubscriptionController.php`
  - [ ] `index()` - Get current subscription status
    - Return tenant's active subscription
    - Return available plans
    - Return billing history
  - [ ] `create(Request $request)` - Create new subscription
    - Validate: plan (pro, enterprise), payment_method_id
    - Create Stripe subscription via Cashier
    - Return subscription details
  - [ ] `update(Request $request)` - Upgrade/downgrade subscription
    - Change plan (swap)
    - Prorate charges
  - [ ] `cancel()` - Cancel subscription
    - Cancel at period end or immediately
  - [ ] `resume()` - Resume canceled subscription

**Controller Example:**
```php
class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $tenant = $request->user()->currentTenant();

        return response()->json([
            'current_plan' => $tenant->subscription_tier ?? 'free',
            'subscription' => $tenant->subscription('default'),
            'plans' => config('subscriptions.plans'),
            'invoices' => $tenant->invoicesIncludingPending(),
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:pro,enterprise',
            'payment_method_id' => 'required|string',
        ]);

        $tenant = $request->user()->currentTenant();
        $priceId = config("subscriptions.plans.{$request->plan}.stripe_price_id");

        $subscription = $tenant->newSubscription('default', $priceId)
            ->create($request->payment_method_id);

        // Update tenant subscription tier
        $tenant->update(['subscription_tier' => $request->plan]);

        return response()->json([
            'subscription' => $subscription,
            'message' => 'Subscription created successfully',
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:pro,enterprise',
        ]);

        $tenant = $request->user()->currentTenant();
        $priceId = config("subscriptions.plans.{$request->plan}.stripe_price_id");

        $subscription = $tenant->subscription('default')->swap($priceId);
        $tenant->update(['subscription_tier' => $request->plan]);

        return response()->json([
            'subscription' => $subscription,
            'message' => 'Subscription updated successfully',
        ]);
    }

    public function cancel(Request $request)
    {
        $tenant = $request->user()->currentTenant();
        $subscription = $tenant->subscription('default');

        $subscription->cancel(); // Cancels at period end

        return response()->json([
            'message' => 'Subscription will be canceled at the end of the billing period',
        ]);
    }

    public function resume(Request $request)
    {
        $tenant = $request->user()->currentTenant();
        $subscription = $tenant->subscription('default');

        $subscription->resume();

        return response()->json([
            'message' => 'Subscription resumed successfully',
        ]);
    }
}
```

- [ ] Create routes: `/backend/routes/billing/subscription-routes.php`
  ```php
  Route::get('/', [SubscriptionController::class, 'index']);
  Route::post('/', [SubscriptionController::class, 'create']);
  Route::put('/', [SubscriptionController::class, 'update']);
  Route::post('/cancel', [SubscriptionController::class, 'cancel']);
  Route::post('/resume', [SubscriptionController::class, 'resume']);
  ```

- [ ] Register in `/backend/routes/api.php`:
  ```php
  Route::prefix('/billing/subscription')
      ->middleware(['auth:sanctum', InitializeTenancyByRequestData::class])
      ->group(base_path('routes/billing/subscription-routes.php'));
  ```

### Phase 5: Backend API - Payment Methods

- [ ] Create controller: `/backend/app/Http/Controllers/Billing/PaymentMethodController.php`
  - [ ] `index()` - List saved payment methods
  - [ ] `store(Request $request)` - Add new payment method
  - [ ] `update(Request $request, $id)` - Set default payment method
  - [ ] `destroy($id)` - Remove payment method

### Phase 6: Stripe Webhooks

- [ ] Configure webhook endpoint in Stripe Dashboard:
  - URL: `https://yourdomain.com/stripe/webhook`
  - Events to listen for:
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_succeeded`
    - `invoice.payment_failed`

- [ ] Laravel Cashier automatically handles webhooks at `/stripe/webhook`
  - [ ] Verify webhook route is registered (Cashier adds it automatically)
  - [ ] Set `STRIPE_WEBHOOK_SECRET` in `.env`

- [ ] Create webhook handler: `/backend/app/Listeners/StripeEventListener.php` (optional, for custom logic)
  - [ ] Listen to Cashier events
  - [ ] Send notifications to admins on payment failures
  - [ ] Log subscription changes

### Phase 7: Trial Periods (Optional)

- [ ] Offer 14-day free trial for Pro/Enterprise
- [ ] Update subscription creation:
  ```php
  $subscription = $tenant->newSubscription('default', $priceId)
      ->trialDays(14)
      ->create($request->payment_method_id);
  ```

- [ ] Display trial status in UI
- [ ] Send trial expiration reminders (notification system)

### Phase 8: Frontend Service

- [ ] Create service: `/frontend/src/services/BillingService.js`
  ```javascript
  class BillingService {
      static async getSubscription() {
          return axios.get('/api/billing/subscription');
      }

      static async createSubscription(plan, paymentMethodId) {
          return axios.post('/api/billing/subscription', {
              plan,
              payment_method_id: paymentMethodId
          });
      }

      static async updateSubscription(plan) {
          return axios.put('/api/billing/subscription', { plan });
      }

      static async cancelSubscription() {
          return axios.post('/api/billing/subscription/cancel');
      }

      static async resumeSubscription() {
          return axios.post('/api/billing/subscription/resume');
      }

      static async getPaymentMethods() {
          return axios.get('/api/billing/payment-methods');
      }

      static async addPaymentMethod(paymentMethodId) {
          return axios.post('/api/billing/payment-methods', {
              payment_method_id: paymentMethodId
          });
      }
  }
  ```

### Phase 9: Frontend - Stripe Elements Integration

- [ ] Install Stripe.js: `npm install @stripe/stripe-js @stripe/react-stripe-js`
- [ ] Create component: `/frontend/src/components/Billing/StripePaymentForm.js`
  - [ ] Wrap with `<Elements>` provider
  - [ ] Use `<CardElement>` for card input
  - [ ] Handle payment method creation
  - [ ] Return payment method ID to parent

**Example:**
```jsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            console.error(error);
        } else {
            onSuccess(paymentMethod.id);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <Button type="submit" disabled={!stripe} label="Subscribe" />
        </form>
    );
};

export const StripePaymentForm = ({ onSuccess }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm onSuccess={onSuccess} />
    </Elements>
);
```

### Phase 10: Frontend - Pricing Page

- [ ] Create page: `/frontend/src/pages/pricing.js` (Public page)
  - [ ] Display all subscription tiers in card layout
  - [ ] List features per tier
  - [ ] Pricing per month
  - [ ] "Get Started" / "Upgrade" buttons
  - [ ] FAQ section
  - [ ] Comparison table

**Layout:**
```
+----------------+  +----------------+  +----------------+
|   Free Tier    |  |   Pro Tier     |  | Enterprise     |
|   $0/month     |  |  $10/month     |  |  $50/month     |
|                |  |                |  |                |
| ✓ Feature 1    |  | ✓ Feature 1    |  | ✓ Feature 1    |
| ✓ Feature 2    |  | ✓ Feature 2    |  | ✓ Feature 2    |
| ✗ Feature 3    |  | ✓ Feature 3    |  | ✓ Feature 3    |
|                |  | ✓ Feature 4    |  | ✓ Feature 4    |
|                |  |                |  | ✓ Feature 5    |
| [Get Started]  |  | [Upgrade]      |  | [Contact Us]   |
+----------------+  +----------------+  +----------------+
```

### Phase 11: Frontend - Billing Dashboard

- [ ] Create page: `/frontend/src/pages/settings/billing.js` (Admin only)
  - [ ] Current plan display
  - [ ] Subscription status (active, canceled, trial)
  - [ ] Next billing date and amount
  - [ ] Change plan buttons (upgrade/downgrade)
  - [ ] Cancel subscription button
  - [ ] Payment method management
  - [ ] Billing history (invoices)

- [ ] Create component: `/frontend/src/components/Billing/SubscriptionCard.js`
  - [ ] Shows current plan with badge (Free, Pro, Enterprise)
  - [ ] Features included in plan
  - [ ] Usage metrics (e.g., "3/5 projects used")
  - [ ] Upgrade CTA if on free plan

- [ ] Create component: `/frontend/src/components/Billing/InvoiceList.js`
  - [ ] DataTable of past invoices
  - [ ] Columns: Date, Amount, Status, Download PDF
  - [ ] Use Cashier's `$tenant->invoices()`

### Phase 12: Subscription Change Flow

- [ ] User clicks "Upgrade to Pro" on pricing page or in-app prompt
- [ ] Redirect to checkout page: `/checkout?plan=pro`
- [ ] Show plan details and pricing
- [ ] Stripe payment form (StripePaymentForm component)
- [ ] Submit payment method + create subscription
- [ ] On success: Redirect to dashboard, show success toast, reload features
- [ ] On error: Show error message, allow retry

### Phase 13: Enforce Subscription Limits

- [ ] Use feature flags (Issue #16) to gate features
- [ ] Add usage checks for numeric limits:
  - [ ] Max users: Check before adding new user to tenant
  - [ ] Max projects: Check before creating new project
  - [ ] Return error if limit exceeded: "Upgrade to Pro for unlimited projects"

**Example Middleware or Service:**
```php
class SubscriptionLimitService
{
    public function canAddUser(Tenant $tenant): bool
    {
        $plan = config("subscriptions.plans.{$tenant->subscription_tier}");
        $maxUsers = $plan['features']['max_users'];

        if ($maxUsers === null) {
            return true; // Unlimited
        }

        $currentUsers = $tenant->users()->count();
        return $currentUsers < $maxUsers;
    }

    public function canAddProject(Tenant $tenant): bool
    {
        $plan = config("subscriptions.plans.{$tenant->subscription_tier}");
        $maxProjects = $plan['features']['max_projects'];

        if ($maxProjects === null) {
            return true; // Unlimited
        }

        $currentProjects = $tenant->projects()->count();
        return $currentProjects < $maxProjects;
    }
}
```

- [ ] Inject checks into controllers:
  ```php
  public function store(Request $request)
  {
      $tenant = $request->user()->currentTenant();

      if (!app(SubscriptionLimitService::class)->canAddProject($tenant)) {
          return response()->json([
              'message' => 'Project limit reached. Upgrade to Pro for unlimited projects.',
              'upgrade_required' => true,
          ], 403);
      }

      // Create project...
  }
  ```

### Phase 14: Testing

- [ ] Backend Testing
  - [ ] Test subscription creation with test Stripe keys
  - [ ] Test subscription upgrade/downgrade
  - [ ] Test subscription cancellation
  - [ ] Test webhook handling (use Stripe CLI to trigger events)
  - [ ] Test trial period functionality
  - [ ] Test usage limit enforcement
  - [ ] Test multi-tenant isolation (subscriptions scoped to tenant)

- [ ] Frontend Testing
  - [ ] Test pricing page displays correctly
  - [ ] Test checkout flow (Stripe Elements)
  - [ ] Test billing dashboard shows correct subscription
  - [ ] Test upgrade flow from free to pro
  - [ ] Test payment method addition/removal
  - [ ] Test invoice download
  - [ ] Test subscription cancellation flow

- [ ] Integration Testing
  - [ ] Free user hits project limit → Upgrade prompt → Subscribes to Pro → Limit removed
  - [ ] Subscription payment fails → Webhook → User notified → Subscription suspended
  - [ ] User cancels subscription → Access continues until period end → Downgraded to free
  - [ ] Webhook triggers feature flag updates

## Critical Files

### Backend Files to Modify:
- `/backend/app/Models/Tenant.php` - Add Billable trait
- `/backend/.env` - Add Stripe keys
- Migrations: Add billing fields to tenants

### Backend Files to Create:
- `/backend/config/subscriptions.php` - Plan definitions
- `/backend/app/Http/Controllers/Billing/SubscriptionController.php`
- `/backend/app/Http/Controllers/Billing/PaymentMethodController.php`
- `/backend/app/Services/SubscriptionLimitService.php`
- `/backend/routes/billing/subscription-routes.php`
- `/backend/app/Listeners/StripeEventListener.php` (optional)

### Frontend Files to Create:
- `/frontend/src/services/BillingService.js`
- `/frontend/src/components/Billing/StripePaymentForm.js`
- `/frontend/src/components/Billing/SubscriptionCard.js`
- `/frontend/src/components/Billing/InvoiceList.js`
- `/frontend/src/pages/pricing.js`
- `/frontend/src/pages/settings/billing.js`
- `/frontend/src/pages/checkout.js`

### Frontend Files to Modify:
- `/frontend/.env.local` - Add `NEXT_PUBLIC_STRIPE_KEY`
- Navigation - Add "Billing" link to settings menu
- Various pages - Add upgrade prompts for locked features

## Verification Checklist

- [ ] Laravel Cashier installed and configured
- [ ] Stripe products and prices created in dashboard
- [ ] Subscription creation works with test card
- [ ] Subscription upgrade/downgrade works
- [ ] Subscription cancellation works
- [ ] Webhooks receive and process Stripe events
- [ ] Trial periods work correctly
- [ ] Frontend pricing page displays all plans
- [ ] Checkout flow creates subscription successfully
- [ ] Billing dashboard shows subscription status
- [ ] Payment method management works
- [ ] Invoice list displays and downloads work
- [ ] Usage limits enforced correctly
- [ ] Feature flags updated based on subscription tier
- [ ] Upgrade prompts display for free users
- [ ] All tests pass

## Success Criteria

✅ **Complete when:**
1. Users can subscribe to Pro/Enterprise plans
2. Payment processing works via Stripe
3. Subscriptions can be upgraded, downgraded, canceled
4. Usage limits enforced based on plan
5. Feature flags gate premium features
6. Billing dashboard functional
7. Webhooks handle payment events
8. All tests pass
9. Documentation and pricing page published

## Future Enhancements

- Annual billing with discount (20% off)
- Team/user-based pricing (per-seat model)
- Custom enterprise pricing (contact sales)
- Coupon/promo code support
- Affiliate program
- Usage-based billing for API calls
- Invoice customization (company branding)
- Multi-currency support

## Next Steps After Completion

- Close Issue #17 on GitHub
- Launch marketing for paid plans
- Monitor conversion rates and churn
- Gather feedback on pricing
- Adjust feature matrix based on user needs

## Notes

- Stripe test mode allows full testing without real charges
- Use test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)
- Webhooks are critical - test thoroughly with Stripe CLI
- Consider adding usage analytics to help users understand value
- Pricing is a product decision - validate with potential customers first
- Feature flags (Issue #16) must be complete before implementing billing
- Start simple (Free + Pro), add Enterprise tier later if needed
- Consider offering discounts for annual commitments
- Compliance: Ensure GDPR, PCI-DSS compliance (Stripe handles most)
