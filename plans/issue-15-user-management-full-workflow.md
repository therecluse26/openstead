# Issue #15: User Management - Full Approval Workflow

**Priority:** 🟡 MEDIUM (High Business Value)
**Complexity:** Medium-Hard
**Estimated Time:** 8-10 hours
**Status:** 80% Complete (CRUD done, workflows needed)

## Overview

Complete the tenant user management system with invite links, join request workflows, and admin approval processes. This enables tenant admins to manage team members and control access to their homestead/farm data.

## Current State

### ✅ Already Implemented
- Full user CRUD UI (list, detail, add, edit pages)
- UserForm with role/permission assignment via MultiSelect
- Backend UserController with all CRUD operations
- User-tenant relationship via pivot table (`tenant_users`)
- Pivot stores `roles` (JSON) and `permissions` (JSON) per user per tenant
- Permission-based access control via `user-can` middleware
- Authorization checks in frontend via `useAuthorizationStore().userCan()`

### ❌ Missing Functionality (Full Scope)
- Invite link generation (create token, send email)
- Welcome email integration when user joins
- "Request to join tenant" workflow (multi-entrypoint registration)
- Admin approval/rejection process for join requests
- Notification system for pending approvals (email + in-app)
- Badge count for pending requests in admin UI

## Implementation Plan

### Phase 1: Database Schema - Invite Links

- [ ] Create migration: `create_tenant_invites_table`
  - [ ] `id` (ULID primary key)
  - [ ] `tenant_id` (string, foreign key to tenants)
  - [ ] `token` (string, unique, indexed) - UUID or random hash
  - [ ] `email` (string, nullable) - Optional: pre-filled invitee email
  - [ ] `invited_by` (string, foreign key to users) - Who created invite
  - [ ] `roles` (JSON) - Pre-assigned roles for invitee
  - [ ] `permissions` (JSON) - Pre-assigned permissions
  - [ ] `expires_at` (timestamp) - Invite expiration (default 7 days)
  - [ ] `used_at` (timestamp, nullable) - When invite was accepted
  - [ ] `used_by` (string, nullable, foreign key to users)
  - [ ] `created_at`, `updated_at`
  - [ ] Add index on `token`
  - [ ] Add index on `tenant_id`

- [ ] Create model: `/backend/app/Models/TenantInvite.php`
  - [ ] Use `HasUlids` trait
  - [ ] Use `BelongsToTenant` trait
  - [ ] Casts: `roles` and `permissions` as `array`
  - [ ] Casts: `expires_at`, `used_at` as `datetime`
  - [ ] Relationship: `belongsTo(Tenant::class)`
  - [ ] Relationship: `belongsTo(User::class, 'invited_by')`
  - [ ] Relationship: `belongsTo(User::class, 'used_by')`
  - [ ] Scope: `scopeValid()` - not expired, not used
  - [ ] Method: `isValid()` - check expiration and usage
  - [ ] Method: `markAsUsed(User $user)` - set used_at and used_by

### Phase 2: Database Schema - Join Requests

- [ ] Create migration: `create_tenant_join_requests_table`
  - [ ] `id` (ULID primary key)
  - [ ] `tenant_id` (string, foreign key to tenants)
  - [ ] `user_id` (string, foreign key to users) - Requesting user
  - [ ] `status` (enum: 'pending', 'approved', 'rejected') - default 'pending'
  - [ ] `message` (text, nullable) - Optional message from requester
  - [ ] `reviewed_by` (string, nullable, foreign key to users) - Admin who approved/rejected
  - [ ] `reviewed_at` (timestamp, nullable)
  - [ ] `rejection_reason` (text, nullable) - Optional reason for rejection
  - [ ] `created_at`, `updated_at`
  - [ ] Add index on `tenant_id`
  - [ ] Add index on `user_id`
  - [ ] Add index on `status`
  - [ ] Unique constraint on `[tenant_id, user_id]` for pending requests

- [ ] Create model: `/backend/app/Models/TenantJoinRequest.php`
  - [ ] Use `HasUlids` trait
  - [ ] Use `BelongsToTenant` trait
  - [ ] Casts: `status` as `TenantJoinRequestStatus` enum
  - [ ] Relationship: `belongsTo(Tenant::class)`
  - [ ] Relationship: `belongsTo(User::class)` - requester
  - [ ] Relationship: `belongsTo(User::class, 'reviewed_by')` - reviewer
  - [ ] Scope: `scopePending()` - only pending requests
  - [ ] Method: `approve(User $admin, array $roles, array $permissions)` - approve and add to tenant
  - [ ] Method: `reject(User $admin, string $reason = null)` - reject request

- [ ] Create enum: `/backend/app/Enums/TenantJoinRequestStatus.php`
  - [ ] `Pending = 'pending'`
  - [ ] `Approved = 'approved'`
  - [ ] `Rejected = 'rejected'`

### Phase 3: Backend API - Invite Links

- [ ] Create controller: `/backend/app/Http/Controllers/Tenants/TenantInviteController.php`
  - [ ] `index()` - List all invites for tenant (admin only)
  - [ ] `store(Request $request)` - Create new invite
    - Validate: email (optional), roles, permissions, expires_at
    - Generate unique token (use `Str::random(64)` or UUID)
    - Create TenantInvite record
    - Send invite email (if email provided)
    - Return invite URL with token
  - [ ] `show($token)` - Get invite details (public, for registration page)
    - Verify token exists and is valid
    - Return tenant info, pre-filled roles/permissions
  - [ ] `destroy($id)` - Revoke/delete invite (admin only)
  - [ ] `resend($id)` - Resend invite email (admin only)

- [ ] Create routes: `/backend/routes/tenants/tenant-invite-routes.php`
  ```php
  Route::get('/', [TenantInviteController::class, 'index'])
      ->middleware('user-can:user:list');
  Route::post('/', [TenantInviteController::class, 'store'])
      ->middleware('user-can:user:create');
  Route::get('/{token}', [TenantInviteController::class, 'show']); // Public
  Route::delete('/{id}', [TenantInviteController::class, 'destroy'])
      ->middleware('user-can:user:delete');
  Route::post('/{id}/resend', [TenantInviteController::class, 'resend'])
      ->middleware('user-can:user:create');
  ```

- [ ] Register routes in `/backend/routes/api.php`:
  ```php
  Route::prefix('/tenants/{tenantId}/invites')->group(
      base_path('routes/tenants/tenant-invite-routes.php')
  );
  ```

### Phase 4: Backend API - Join Requests

- [ ] Create controller: `/backend/app/Http/Controllers/Tenants/TenantJoinRequestController.php`
  - [ ] `index()` - List all join requests for tenant (admin only)
    - Support filtering by status (pending, approved, rejected)
    - Include user relationship data
  - [ ] `store(Request $request)` - Create join request (public, authenticated)
    - Validate: tenant exists, user not already member, no pending request
    - Create TenantJoinRequest record
    - Send notification to tenant admins
    - Return confirmation message
  - [ ] `show($id)` - Get join request details (admin or requester only)
  - [ ] `approve($id, Request $request)` - Approve request (admin only)
    - Validate: roles and permissions in request
    - Call `$request->approve($admin, $roles, $permissions)`
    - Add user to tenant via `tenant_users` pivot
    - Send approval email to requester
    - Return success
  - [ ] `reject($id, Request $request)` - Reject request (admin only)
    - Validate: optional rejection reason
    - Call `$request->reject($admin, $reason)`
    - Send rejection email to requester
    - Return success
  - [ ] `destroy($id)` - Cancel own join request (requester only)

- [ ] Create routes: `/backend/routes/tenants/tenant-join-request-routes.php`
  ```php
  Route::get('/', [TenantJoinRequestController::class, 'index'])
      ->middleware('user-can:user:list');
  Route::post('/', [TenantJoinRequestController::class, 'store']); // Public (auth required)
  Route::get('/{id}', [TenantJoinRequestController::class, 'show']);
  Route::post('/{id}/approve', [TenantJoinRequestController::class, 'approve'])
      ->middleware('user-can:user:create');
  Route::post('/{id}/reject', [TenantJoinRequestController::class, 'reject'])
      ->middleware('user-can:user:delete');
  Route::delete('/{id}', [TenantJoinRequestController::class, 'destroy']);
  ```

- [ ] Register routes in `/backend/routes/api.php`:
  ```php
  Route::prefix('/tenants/{tenantId}/join-requests')->group(
      base_path('routes/tenants/tenant-join-request-routes.php')
  );
  ```

### Phase 5: Email Integration

- [ ] Create mail template: `/backend/resources/views/emails/tenant-invite.blade.php`
  - [ ] Welcome message
  - [ ] Tenant name and description
  - [ ] Invite link with token
  - [ ] Expiration date
  - [ ] Call-to-action button

- [ ] Create mailable: `/backend/app/Mail/TenantInvite.php`
  - [ ] Constructor: `__construct(TenantInvite $invite, string $inviteUrl)`
  - [ ] Method: `build()` - render email template
  - [ ] Subject: "You're invited to join {tenant_name} on Openstead"

- [ ] Create mail template: `/backend/resources/views/emails/join-request-submitted.blade.php`
  - [ ] Confirmation that request was received
  - [ ] What happens next (admin review)

- [ ] Create mail template: `/backend/resources/views/emails/join-request-approved.blade.php`
  - [ ] Congratulations message
  - [ ] Link to tenant dashboard
  - [ ] Assigned roles/permissions

- [ ] Create mail template: `/backend/resources/views/emails/join-request-rejected.blade.php`
  - [ ] Polite rejection message
  - [ ] Optional: reason for rejection
  - [ ] Encourage to contact admin if questions

- [ ] Create mail template: `/backend/resources/views/emails/join-request-pending-admin.blade.php`
  - [ ] Notification to tenant admins
  - [ ] User info requesting to join
  - [ ] Optional message from requester
  - [ ] Link to approve/reject

- [ ] Create mailables for each template
  - [ ] `JoinRequestSubmitted.php`
  - [ ] `JoinRequestApproved.php`
  - [ ] `JoinRequestRejected.php`
  - [ ] `JoinRequestPendingAdmin.php`

- [ ] Configure mail settings in `.env`
  - [ ] Verify MAIL_* settings configured
  - [ ] Test email delivery (use Mailtrap for dev)

### Phase 6: Frontend - Invite Link Generation

- [ ] Create service: `/frontend/src/services/TenantInviteService.js`
  ```javascript
  class TenantInviteService {
      static async getAll(tenantId) {
          return axios.get(`/api/tenants/${tenantId}/invites`);
      }
      static async create(tenantId, data) {
          return axios.post(`/api/tenants/${tenantId}/invites`, data);
      }
      static async revoke(tenantId, inviteId) {
          return axios.delete(`/api/tenants/${tenantId}/invites/${inviteId}`);
      }
      static async resend(tenantId, inviteId) {
          return axios.post(`/api/tenants/${tenantId}/invites/${inviteId}/resend`);
      }
      static async getByToken(token) {
          return axios.get(`/api/tenants/invites/${token}`);
      }
  }
  ```

- [ ] Create component: `/frontend/src/components/Tenants/InviteUserDialog.js`
  - [ ] Modal dialog using PrimeReact Dialog
  - [ ] Form fields:
    - [ ] Email (optional, for sending email)
    - [ ] Roles (multiselect)
    - [ ] Permissions (multiselect)
    - [ ] Expiration (date picker, default 7 days)
  - [ ] Submit button: "Generate Invite Link"
  - [ ] On success:
    - [ ] Show invite URL in copyable input field
    - [ ] "Copy Link" button
    - [ ] "Send Email" button (if email provided)
    - [ ] Toast: "Invite created successfully"

- [ ] Update `/frontend/src/pages/users/index.js` (User List Page)
  - [ ] Add "Invite User" button next to "Add User"
  - [ ] Restrict with `<Restrict permission="user:create">`
  - [ ] Opens InviteUserDialog on click
  - [ ] Refresh list after invite created (optional)

- [ ] Create page: `/frontend/src/pages/users/invites.js` (Invite Management)
  - [ ] List all active invites
  - [ ] DataTable showing: email, roles, expires_at, created_by, status
  - [ ] Actions: Copy Link, Resend Email, Revoke
  - [ ] Filter: Show only valid invites vs all invites

### Phase 7: Frontend - Join Request Workflow

- [ ] Create service: `/frontend/src/services/TenantJoinRequestService.js`
  ```javascript
  class TenantJoinRequestService {
      static async getAll(tenantId, params) {
          return axios.get(`/api/tenants/${tenantId}/join-requests`, { params });
      }
      static async create(tenantId, data) {
          return axios.post(`/api/tenants/${tenantId}/join-requests`, data);
      }
      static async approve(tenantId, requestId, data) {
          return axios.post(`/api/tenants/${tenantId}/join-requests/${requestId}/approve`, data);
      }
      static async reject(tenantId, requestId, data) {
          return axios.post(`/api/tenants/${tenantId}/join-requests/${requestId}/reject`, data);
      }
      static async cancel(tenantId, requestId) {
          return axios.delete(`/api/tenants/${tenantId}/join-requests/${requestId}`);
      }
  }
  ```

- [ ] Create component: `/frontend/src/components/Tenants/JoinRequestList.js`
  - [ ] DataTable with pending join requests
  - [ ] Columns: User Name, Email, Message, Requested Date
  - [ ] Actions per row:
    - [ ] "Approve" button → opens ApproveDialog
    - [ ] "Reject" button → opens RejectDialog
  - [ ] Badge count for pending requests
  - [ ] Real-time updates (polling or WebSocket if available)

- [ ] Create component: `/frontend/src/components/Tenants/ApproveJoinRequestDialog.js`
  - [ ] Dialog showing user info
  - [ ] Form to assign roles and permissions (MultiSelect)
  - [ ] "Approve" button
  - [ ] On success: refresh list, show toast

- [ ] Create component: `/frontend/src/components/Tenants/RejectJoinRequestDialog.js`
  - [ ] Dialog with optional rejection reason (textarea)
  - [ ] "Reject" button (confirm action)
  - [ ] On success: refresh list, show toast

- [ ] Create page: `/frontend/src/pages/users/join-requests.js`
  - [ ] Tabs: Pending | Approved | Rejected
  - [ ] Use JoinRequestList component
  - [ ] Restrict access to admins only
  - [ ] Badge notification in sidebar menu (pending count)

### Phase 8: Frontend - Registration Flow Updates

- [ ] Update `/frontend/src/pages/register.js`
  - [ ] Check URL for `?invite={token}` parameter
  - [ ] If invite token present:
    - [ ] Fetch invite details via `TenantInviteService.getByToken(token)`
    - [ ] Pre-fill tenant info (read-only)
    - [ ] Pre-fill roles/permissions (hidden, auto-assigned)
    - [ ] On successful registration, mark invite as used
    - [ ] Auto-join tenant (no approval needed)
  - [ ] If NO invite token:
    - [ ] Show option: "Create new tenant" or "Request to join existing tenant"
    - [ ] If "Request to join":
      - [ ] Show tenant search/selection
      - [ ] Optional message field
      - [ ] Submit join request
      - [ ] Show confirmation: "Request submitted, awaiting approval"

- [ ] Create component: `/frontend/src/components/Auth/TenantSelector.js`
  - [ ] Search tenants by name
  - [ ] Display tenant cards with description
  - [ ] "Request to Join" button per tenant
  - [ ] Note: May need public API endpoint to list tenants (security consideration)

### Phase 9: Notifications & UI Polish

- [ ] Add pending join request badge to sidebar
  - [ ] Fetch count: `/api/tenants/{id}/join-requests?status=pending&count=true`
  - [ ] Display badge number on "Users" or "Join Requests" menu item
  - [ ] Poll for updates every 60 seconds (or use WebSocket)

- [ ] Add in-app notification when new join request created
  - [ ] Toast notification to online admins
  - [ ] Use existing ToastContext

- [ ] Update user detail page: `/frontend/src/pages/users/[id]/index.js`
  - [ ] Show "Invite History" section (if user was invited)
  - [ ] Show "Join Request History" section (if user requested)

### Phase 10: Permissions & Authorization

- [ ] Verify permissions for new endpoints
  - [ ] Invite creation: `user:create` permission required
  - [ ] Join request approval: `user:create` permission required
  - [ ] Join request rejection: `user:delete` permission required (or create new permission)
  - [ ] Viewing join requests: `user:list` permission required

- [ ] Update frontend authorization checks
  - [ ] `<Restrict permission="user:create">` around invite buttons
  - [ ] `<Restrict permission="user:list">` around join request page

- [ ] Consider adding new permissions (optional):
  - [ ] `user:invite` - specific permission for inviting users
  - [ ] `user:approve-requests` - specific permission for approving join requests

### Phase 11: Testing

- [ ] Backend Testing
  - [ ] Create PHPUnit tests for TenantInviteController
  - [ ] Create PHPUnit tests for TenantJoinRequestController
  - [ ] Test invite creation, validation, expiration
  - [ ] Test join request approval/rejection
  - [ ] Test email sending (use Mail::fake())
  - [ ] Test multi-tenant isolation (invites scoped to tenant)

- [ ] Frontend Testing
  - [ ] Test invite link generation UI
  - [ ] Test copy-to-clipboard functionality
  - [ ] Test join request list display
  - [ ] Test approve/reject workflows
  - [ ] Test registration with invite token
  - [ ] Test registration without invite (request to join)

- [ ] Integration Testing
  - [ ] Full workflow: Admin creates invite → User registers → Auto-joined
  - [ ] Full workflow: User requests to join → Admin approves → User joined
  - [ ] Full workflow: User requests to join → Admin rejects → User notified
  - [ ] Email delivery verification (use Mailtrap)
  - [ ] Multi-tenant isolation (user in Tenant A can't approve requests for Tenant B)
  - [ ] Permission enforcement at API level

- [ ] Edge Cases
  - [ ] Expired invite token
  - [ ] Already-used invite token
  - [ ] Duplicate join request (same user, same tenant)
  - [ ] User already member of tenant
  - [ ] Invalid invite token
  - [ ] Missing permissions for actions

## Critical Files

### Backend Files to Create:
- `/backend/database/migrations/*_create_tenant_invites_table.php`
- `/backend/database/migrations/*_create_tenant_join_requests_table.php`
- `/backend/app/Models/TenantInvite.php`
- `/backend/app/Models/TenantJoinRequest.php`
- `/backend/app/Enums/TenantJoinRequestStatus.php`
- `/backend/app/Http/Controllers/Tenants/TenantInviteController.php`
- `/backend/app/Http/Controllers/Tenants/TenantJoinRequestController.php`
- `/backend/routes/tenants/tenant-invite-routes.php`
- `/backend/routes/tenants/tenant-join-request-routes.php`
- `/backend/app/Mail/TenantInvite.php` (+ other mailables)
- `/backend/resources/views/emails/tenant-invite.blade.php` (+ other templates)

### Backend Files to Modify:
- `/backend/routes/api.php` - Register new route groups
- `/backend/app/Enums/Authorization/Permission.php` - Add new permissions (if needed)

### Frontend Files to Create:
- `/frontend/src/services/TenantInviteService.js`
- `/frontend/src/services/TenantJoinRequestService.js`
- `/frontend/src/components/Tenants/InviteUserDialog.js`
- `/frontend/src/components/Tenants/JoinRequestList.js`
- `/frontend/src/components/Tenants/ApproveJoinRequestDialog.js`
- `/frontend/src/components/Tenants/RejectJoinRequestDialog.js`
- `/frontend/src/components/Auth/TenantSelector.js`
- `/frontend/src/pages/users/invites.js`
- `/frontend/src/pages/users/join-requests.js`

### Frontend Files to Modify:
- `/frontend/src/pages/users/index.js` - Add "Invite User" button
- `/frontend/src/pages/register.js` - Handle invite token, join request flow
- Sidebar menu component - Add badge for pending join requests

## Verification Checklist

### Invite Links:
- [ ] Admin can generate invite link from user management page
- [ ] Invite email sent successfully (if email provided)
- [ ] Invite link copyable to clipboard
- [ ] Registration with valid invite token auto-joins user to tenant
- [ ] Registration with expired invite shows error
- [ ] Registration with used invite shows error
- [ ] Roles/permissions from invite applied to user
- [ ] Admin can view all active invites
- [ ] Admin can revoke invite
- [ ] Admin can resend invite email

### Join Requests:
- [ ] User can request to join tenant from registration page
- [ ] Join request notification sent to tenant admins via email
- [ ] Admin sees pending join requests in UI
- [ ] Admin can approve join request (assign roles/permissions)
- [ ] Admin can reject join request (optional reason)
- [ ] User receives approval email with link to tenant
- [ ] User receives rejection email
- [ ] User added to tenant_users pivot on approval
- [ ] User can cancel own join request before review
- [ ] Duplicate join requests prevented

### Security & Permissions:
- [ ] All endpoints protected by appropriate permissions
- [ ] Multi-tenant isolation enforced (can't approve requests for other tenants)
- [ ] Invite tokens are unique and secure
- [ ] Expired invites can't be used
- [ ] Only admins can see/manage invites and requests

### Email Integration:
- [ ] All emails render correctly with tenant branding
- [ ] Email links work and direct to correct pages
- [ ] Emails sent asynchronously (queued, not blocking requests)
- [ ] Email delivery confirmed in dev environment (Mailtrap)

### UX & UI:
- [ ] Invite dialog easy to use, validates input
- [ ] Join request list shows all relevant info
- [ ] Approve/reject dialogs clear and intuitive
- [ ] Toast notifications on success/error
- [ ] Badge count updates in real-time
- [ ] Copy-to-clipboard works reliably
- [ ] Mobile responsive

## Success Criteria

✅ **Complete when:**
1. Tenant admins can generate and send invite links
2. Users can register via invite links (auto-approved)
3. Users can request to join tenants
4. Admins can approve/reject join requests
5. All email notifications sent correctly
6. Multi-tenant isolation enforced
7. Permissions properly restrict access
8. All test cases pass
9. Documentation updated

## Next Steps After Completion

- Close Issue #15 on GitHub
- Update user documentation with invite/join request workflows
- Consider adding analytics (track invite conversion rates, etc.)
- Move to Issue #21 (Workflow Builder) or Issue #12 (Onboarding Flow)

## Notes

- This is a major feature that completes the multi-tenant collaboration model
- Prioritize security: validate all tokens, enforce tenant isolation
- Consider rate limiting on join request creation (prevent spam)
- Future enhancement: Invite link usage analytics
- Future enhancement: Batch invite creation (CSV upload)
- Future enhancement: Customizable invite email templates per tenant
