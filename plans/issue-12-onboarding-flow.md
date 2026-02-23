# Issue #12: Onboarding Flow

**Priority:** 🔵 LOW (Depends on User Management)
**Complexity:** Medium
**Estimated Time:** 10-15 hours
**Status:** Not Started
**Dependencies:** Issue #15 (User Management - invite links, join requests) must be completed first

## Overview

Create a comprehensive onboarding workflow for new users with multiple registration entrypoints:
- Central app registration (create new tenant or request to join existing)
- Tenant-specific registration (subdomain-based, request to join that tenant)
- Invite link registration (auto-approved, pre-assigned roles)

After registration, guide users through initial setup with an onboarding wizard.

## Current State

- ✅ Basic registration exists (from Laravel Breeze)
- ✅ Multi-tenancy fully implemented (Issue #13)
- ❌ No tenant creation flow during registration
- ❌ No join request workflow (Issue #15 required first)
- ❌ No invite link registration flow (Issue #15 required first)
- ❌ No post-registration onboarding wizard

## Registration Entrypoints

### 1. Central App Registration (`openstead.app/register`)
User can choose:
- **Create New Tenant** → Becomes tenant owner/admin
- **Join Existing Tenant** → Search for tenant, submit join request

### 2. Tenant-Specific Registration (`tenant1.openstead.app/register`)
- Pre-fills tenant context
- User submits join request to that specific tenant
- Admin must approve

### 3. Invite Link Registration (`openstead.app/register?invite=TOKEN`)
- Validate invite token
- Pre-fill tenant + roles/permissions
- Auto-approve user upon registration (no admin approval needed)

## Implementation Plan

### Phase 1: Registration Type Detection

- [ ] Update `/frontend/src/pages/register.js`
  - [ ] Check URL params for `?invite=TOKEN`
  - [ ] Check subdomain for tenant context (if using subdomain routing)
  - [ ] Determine registration type:
    - `'invite'` - Has valid invite token
    - `'tenant-specific'` - On tenant subdomain
    - `'central'` - On main domain, no invite

**Route Detection Logic:**
```jsx
const RegisterPage = () => {
    const router = useRouter();
    const { invite: inviteToken } = router.query;
    const [registrationType, setRegistrationType] = useState(null);
    const [inviteData, setInviteData] = useState(null);
    const [selectedTenant, setSelectedTenant] = useState(null);

    useEffect(() => {
        if (inviteToken) {
            // Invite link registration
            validateInvite();
        } else if (window.location.hostname !== 'openstead.app') {
            // Tenant-specific subdomain
            setRegistrationType('tenant-specific');
            fetchTenantFromSubdomain();
        } else {
            // Central app registration
            setRegistrationType('central');
        }
    }, [inviteToken]);

    const validateInvite = async () => {
        try {
            const res = await TenantInviteService.getByToken(inviteToken);
            setInviteData(res.data);
            setRegistrationType('invite');
        } catch (error) {
            // Invalid token
            toast.error('Invalid or expired invite link');
            setRegistrationType('central');
        }
    };
};
```

### Phase 2: Central App Registration - Tenant Creation Flow

- [ ] Create component: `/frontend/src/components/Auth/TenantCreationForm.js`
  - [ ] Fields:
    - [ ] Tenant Name (e.g., "Smith Family Farm")
    - [ ] Description (optional)
    - [ ] Tenant slug (URL-friendly, auto-generated from name)
  - [ ] Validation: Tenant name required, slug unique
  - [ ] Submit: Creates tenant + user account simultaneously

**API Endpoint (Backend):**
```php
// /backend/app/Http/Controllers/Auth/RegisterController.php
public function registerWithTenant(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
        'tenant_name' => 'required|string',
        'tenant_description' => 'nullable|string',
    ]);

    DB::transaction(function() use ($request) {
        // Create tenant
        $tenant = Tenant::create([
            'id' => Str::ulid(),
            'name' => $request->tenant_name,
            'description' => $request->tenant_description,
        ]);

        // Create user
        $user = User::create([
            'id' => Str::ulid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Attach user to tenant as owner/admin
        $tenant->users()->attach($user->id, [
            'roles' => json_encode([Role::Administrator->value]),
            'permissions' => json_encode([]), // Admins have all permissions
        ]);

        // Log in user
        Auth::login($user);

        return $user;
    });

    return response()->json(['message' => 'Registration successful']);
}
```

### Phase 3: Central App Registration - Join Request Flow

- [ ] Create component: `/frontend/src/components/Auth/TenantSearchForm.js`
  - [ ] Search input to find tenants by name
  - [ ] Display tenant cards with name, description
  - [ ] "Request to Join" button per tenant
  - [ ] Optional message field

**Security Note:** Decide if tenant list should be public or require authentication. Options:
- Option A: Public tenant search (may expose tenant names)
- Option B: Require email verification first, then show tenants
- Option C: Private/invite-only (no public search)

**Recommended:** Option B - User registers first, then can search and request to join

- [ ] Update registration flow:
  1. User creates account (without tenant)
  2. User searches for tenants
  3. User submits join request
  4. User sees "Request submitted, awaiting approval" message
  5. Admin approves → User gets email → User can log in and access tenant

### Phase 4: Tenant-Specific Registration

- [ ] Detect subdomain or tenant context from URL
- [ ] Pre-fill tenant information (display tenant name)
- [ ] User submits join request to that tenant
- [ ] Flow same as central app join request, but tenant is pre-selected

**Note:** This may require subdomain routing setup (not currently implemented in Openstead). Consider deferring if subdomain routing is not a priority.

### Phase 5: Invite Link Registration

- [ ] Fetch invite data using token
- [ ] Display: "You've been invited to join [Tenant Name]"
- [ ] Show pre-assigned roles (read-only)
- [ ] User completes registration form (name, email, password)
- [ ] On submit:
  - [ ] Create user account
  - [ ] Mark invite as used
  - [ ] Attach user to tenant with pre-assigned roles/permissions
  - [ ] Auto-login user
  - [ ] Redirect to onboarding wizard

**Registration Form:**
```jsx
const InviteRegistrationForm = ({ inviteData }) => {
    const { control, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        await AuthService.registerWithInvite(inviteToken, {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
        });

        // Auto-login and redirect
        router.push('/onboarding');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Message severity="info" text={`You've been invited to join ${inviteData.tenant.name}`} />

            <TextInput name="name" control={control} label="Full Name" rules={{ required: true }} />
            <TextInput name="email" control={control} label="Email" rules={{ required: true }} defaultValue={inviteData.email} disabled={!!inviteData.email} />
            <TextInput name="password" control={control} label="Password" type="password" rules={{ required: true, minLength: 8 }} />
            <TextInput name="password_confirmation" control={control} label="Confirm Password" type="password" rules={{ required: true }} />

            <div className="mt-3">
                <strong>Your Role:</strong> {inviteData.roles.join(', ')}
            </div>

            <Button type="submit" label="Create Account & Join" className="mt-3" />
        </form>
    );
};
```

### Phase 6: Post-Registration Onboarding Wizard

- [ ] Create page: `/frontend/src/pages/onboarding.js`
  - [ ] Multi-step wizard (use PrimeReact Steps component)
  - [ ] Steps:
    1. Welcome message + quick tour
    2. Profile completion (avatar, preferences)
    3. Invite team members (optional, for tenant owners)
    4. Quick setup (create first project, add first inventory item)
    5. Done → Redirect to dashboard

- [ ] Create component: `/frontend/src/components/Onboarding/OnboardingWizard.js`
  - [ ] State management for current step
  - [ ] "Next" / "Previous" / "Skip" buttons
  - [ ] Progress indicator
  - [ ] Can be dismissed and resumed later (save progress)

**Wizard Steps:**

**Step 1: Welcome**
```jsx
<div className="text-center">
    <h2>Welcome to Openstead!</h2>
    <p>Let's get you set up in just a few steps.</p>
    <Button label="Get Started" onClick={nextStep} />
</div>
```

**Step 2: Profile Setup**
```jsx
<div>
    <h3>Complete Your Profile</h3>
    <FileUpload onSelect={uploadAvatar} />
    <SelectInput name="timezone" options={timezones} />
    <SelectInput name="date_format" options={dateFormats} />
    <Button label="Next" onClick={nextStep} />
</div>
```

**Step 3: Invite Team Members** (Only for tenant owners)
```jsx
<div>
    <h3>Invite Your Team</h3>
    <p>Collaborate with others on your homestead.</p>
    <InviteUserDialog embedded />
    <Button label="Skip for Now" onClick={nextStep} className="p-button-text" />
</div>
```

**Step 4: Quick Start**
```jsx
<div>
    <h3>Let's Create Your First Project</h3>
    <TextInput name="project_name" placeholder="Spring Garden 2024" />
    <Button label="Create Project" onClick={createProject} />
    <Button label="Skip" onClick={nextStep} className="p-button-text" />
</div>
```

**Step 5: Complete**
```jsx
<div className="text-center">
    <i className="pi pi-check-circle" style={{ fontSize: '4rem', color: 'green' }} />
    <h2>You're All Set!</h2>
    <p>Start managing your homestead today.</p>
    <Button label="Go to Dashboard" onClick={() => router.push('/')} />
</div>
```

### Phase 7: Onboarding Progress Tracking

- [ ] Add field to `users` table: `onboarding_completed` (boolean, default false)
- [ ] Add field to `users` table: `onboarding_step` (integer, default 0) - for resuming
- [ ] Update user model to track onboarding status
- [ ] Middleware or check in `_app.js`: If user logged in but `onboarding_completed === false`, redirect to `/onboarding`
- [ ] Allow users to skip onboarding (set `onboarding_completed = true`)

### Phase 8: Email Notifications for Registration Flows

- [ ] Send welcome email on registration (use mailables from Issue #15)
- [ ] For join requests: Send email to user confirming request submitted
- [ ] For join requests: Send email to tenant admins about new pending request
- [ ] For invite registration: Send email to inviter that user accepted

### Phase 9: First-Time User Experience (Optional Enhancements)

- [ ] Interactive product tour (use libraries like Shepherd.js or react-joyride)
- [ ] Tooltips on first visit to each page
- [ ] Sample data (create example project/inventory items for new tenants)
- [ ] Help center links and documentation
- [ ] Video tutorials embedded in wizard

### Phase 10: Testing

- [ ] Backend Testing
  - [ ] Test tenant creation during registration
  - [ ] Test join request creation
  - [ ] Test invite token validation
  - [ ] Test user-tenant attachment with roles
  - [ ] Test email notifications sent correctly

- [ ] Frontend Testing
  - [ ] Test central app registration (create tenant)
  - [ ] Test central app registration (join request)
  - [ ] Test tenant-specific registration (if subdomain routing exists)
  - [ ] Test invite link registration flow
  - [ ] Test onboarding wizard (all steps)
  - [ ] Test wizard skip functionality
  - [ ] Test wizard resume after partial completion
  - [ ] Test redirect to onboarding if incomplete

- [ ] Integration Testing
  - [ ] Full flow: User receives invite → Registers → Onboarding wizard → Dashboard
  - [ ] Full flow: User registers → Creates tenant → Onboarding → Invites team member
  - [ ] Full flow: User registers → Requests to join tenant → Admin approves → User logs in → Onboarding

## Critical Files

### Backend Files to Create:
- `/backend/app/Http/Controllers/Auth/RegisterController.php` - Enhanced registration logic
- Migrations: Add `onboarding_completed`, `onboarding_step` to users table

### Backend Files to Modify:
- Registration routes to handle different registration types
- Email notifications for registration events

### Frontend Files to Create:
- `/frontend/src/components/Auth/TenantCreationForm.js`
- `/frontend/src/components/Auth/TenantSearchForm.js`
- `/frontend/src/components/Auth/InviteRegistrationForm.js`
- `/frontend/src/components/Onboarding/OnboardingWizard.js`
- `/frontend/src/pages/onboarding.js`

### Frontend Files to Modify:
- `/frontend/src/pages/register.js` - Handle multiple registration types
- `/frontend/src/pages/_app.js` - Redirect to onboarding if incomplete
- `/frontend/src/hooks/auth.js` - Track onboarding status

## Verification Checklist

- [ ] User can register and create new tenant (central app)
- [ ] User can register and request to join tenant (central app)
- [ ] User can register via invite link (auto-approved)
- [ ] Tenant-specific registration works (if subdomain routing implemented)
- [ ] Invite token validation works (invalid tokens rejected)
- [ ] User-tenant relationships created correctly with roles
- [ ] Onboarding wizard displays after first login
- [ ] All wizard steps functional
- [ ] Wizard can be skipped
- [ ] Wizard progress saved and can be resumed
- [ ] User redirected to onboarding if incomplete
- [ ] Welcome emails sent on registration
- [ ] Join request emails sent to admins
- [ ] Multi-tenant isolation enforced
- [ ] All tests pass

## Success Criteria

✅ **Complete when:**
1. Users can register via all three entrypoints
2. Tenant creation during registration works
3. Join request workflow functional
4. Invite link registration auto-approves users
5. Onboarding wizard guides new users
6. Email notifications sent appropriately
7. All test cases pass
8. User experience is smooth and intuitive

## Future Enhancements

- Tenant templates (pre-populated projects, inventory categories)
- Customizable onboarding flow per tenant
- Progress tracking analytics (drop-off rates per step)
- Personalized recommendations based on homestead type (farm, garden, livestock focus)
- Video tutorials in onboarding wizard
- Integration with help docs and knowledge base
- Referral program (invite friends, get rewards)

## Next Steps After Completion

- Close Issue #12 on GitHub
- Gather user feedback on onboarding experience
- Optimize based on completion rates
- Consider A/B testing different onboarding flows
- Document registration flows for users

## Notes

- This issue depends heavily on Issue #15 (User Management)
- Subdomain routing may require infrastructure changes (not currently implemented)
- Consider deferring subdomain-based registration if not a priority
- Onboarding wizard significantly improves user activation and retention
- Keep onboarding steps minimal (3-5 steps max) to avoid drop-off
- Allow skipping onboarding but provide "Resume Onboarding" option in settings
- Sample data helps new users understand the platform faster
- Email notifications are critical for join request workflow
