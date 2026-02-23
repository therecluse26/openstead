# Openstead Development Plans

This directory contains detailed implementation plans for all GitHub issues. Each plan includes comprehensive TODO checklists, code examples, critical file references, and verification steps.

## Quick Start Guide

**Recommended Order:**
1. Start with Issue #19 (Quick win, high impact)
2. Move to Issue #20 (Quick polish)
3. Complete Issue #15 (Completes core admin features)
4. Tackle Issue #21 (Major UX enhancement)

## Plan Files by Priority

### 🔴 HIGH Priority - Quick Wins (Foundation/Bug Fixes)

#### [Issue #19: Global React Error Boundary](./issue-19-global-error-boundary.md) ⭐ **START HERE**
**Time:** 2-3 hours | **Complexity:** Easy | **Impact:** High

Implement global error boundary to catch React errors and prevent silent failures. Uses existing ToastContext for consistent error messaging.

**Key Steps:**
- Create ErrorBoundary component
- Wrap app in `_app.js`
- Integrate with ToastContext
- Add fallback UI

#### [Issue #20: Fix RichEditor Floating Label](./issue-20-richeditor-floating-label.md)
**Time:** 1-2 hours | **Complexity:** Easy | **Impact:** Low

Fix floating label behavior on RichTextInput component to match other PrimeReact inputs.

**Key Steps:**
- Add custom CSS for label floating
- Handle Editor focus state
- Test across all forms using RichTextInput

---

### 🟡 MEDIUM Priority - Partially Completed Features

#### [Issue #15: User Management - Full Approval Workflow](./issue-15-user-management-full-workflow.md)
**Time:** 8-10 hours | **Complexity:** Medium-Hard | **Impact:** High

Complete user management with invite links, join requests, and admin approval workflows. **80% already done** - just needs workflows.

**Key Steps:**
- Create TenantInvite and TenantJoinRequest models
- Build invite link generation API
- Build join request approval API
- Create frontend UI for invites and requests
- Email integration

**Current State:** ✅ Full CRUD UI exists, ❌ Missing invite/join workflows

---

### 🟢 MEDIUM-HIGH Priority - New Features with Foundation Ready

#### [Issue #21: Project-Specific Custom Workflow Builder](./issue-21-project-workflow-builder.md)
**Time:** 8-12 hours | **Complexity:** Hard | **Impact:** High

Allow users to customize project workflows (Kanban columns). **Backend infrastructure 100% complete** - just needs UI.

**Key Steps:**
- Create WorkflowBuilder component (drag-drop)
- Add API endpoint to update workflow
- Integrate with project settings page
- Handle status removal impact on existing items

**Current State:** ✅ Backend ready, ❌ UI needed

---

### 🔵 LOW Priority - Longer-Term Features

#### [Issue #10: Calendar System](./issue-10-calendar-system.md)
**Time:** 30-40 hours | **Complexity:** Very Hard | **Impact:** High

Comprehensive calendar with manual events, recurring events, auto-generated reminders, and multi-channel notifications.

**Major Feature - Requires:**
- Recurring event logic
- Notification system
- Auto-event generation from other modules
- Push notifications (optional)

---

#### [Issue #16: Feature Flags](./issue-16-feature-flags.md)
**Time:** 6-10 hours | **Complexity:** Medium | **Impact:** High (Foundation)

Implement feature flag system using Laravel Pennant for billing tiers, gradual rollouts, and A/B testing.

**Key Steps:**
- Install Laravel Pennant
- Define feature flags
- Create frontend FeatureGate component
- Integrate with billing (Issue #17)

**Required Before:** Issue #17 (Billing)

---

#### [Issue #17: Billing/Subscriptions](./issue-17-billing-subscriptions.md)
**Time:** 20-30 hours | **Complexity:** Hard | **Impact:** High (Business)

Implement freemium billing with Stripe integration. Requires Issue #16 (Feature Flags) to be completed first.

**Key Steps:**
- Install Laravel Cashier
- Define subscription tiers
- Create Stripe checkout flow
- Build billing dashboard
- Enforce subscription limits

**Dependencies:** Issue #16 must be complete

---

#### [Issue #12: Onboarding Flow](./issue-12-onboarding-flow.md)
**Time:** 10-15 hours | **Complexity:** Medium | **Impact:** Medium

Multi-entrypoint registration with post-signup onboarding wizard. Depends on Issue #15 (User Management).

**Key Steps:**
- Registration type detection (central, tenant-specific, invite)
- Tenant creation during registration
- Join request workflow
- Post-registration wizard

**Dependencies:** Issue #15 (User Management)

---

#### [Issue #25: Plant Database/API Integration](./issue-25-plant-database-api.md)
**Time:** 12-20 hours | **Complexity:** Medium-Hard | **Impact:** Medium

Integrate with plant APIs (Trefle, OpenFarm) using strategy pattern. Cache plant data locally to enhance seed inventory.

**Key Steps:**
- Implement plant data providers (Trefle, OpenFarm)
- Create local plant cache
- Build plant search autocomplete
- Integrate with seed inventory

---

## Issue #13: Multi-Tenancy

**Status:** ✅ **ALREADY COMPLETE** - Should be closed on GitHub

Multi-tenancy is fully implemented using Stancl Tenancy:
- Single-DB architecture with `tenant_id` scoping
- `BelongsToTenant` trait applied across models
- X-Tenant header routing via middleware
- Frontend TenantStore with persistence

**Action Required:** Close issue #13 on GitHub

---

## How to Use These Plans

### 1. Read the Plan
Each plan includes:
- Overview and current state
- Detailed implementation steps with checkboxes
- Code examples and patterns
- Critical files to create/modify
- Testing strategy
- Verification checklist

### 2. Track Progress
Use the checkboxes in each plan to track your progress:
```markdown
- [ ] Create model
- [ ] Create migration
- [ ] Create controller
```

### 3. Reference During Implementation
Plans include:
- File paths for all changes
- Code snippets you can adapt
- Technical considerations
- Common pitfalls to avoid

### 4. Verify Completion
Each plan has a "Success Criteria" section - complete when all criteria are met.

---

## Development Roadmap

### Sprint 1: Foundation & Quick Wins (8-12 hours)
1. ✅ Issue #19: Global Error Boundary (2-3 hrs)
2. ✅ Issue #20: RichEditor Label Fix (1-2 hrs)
3. ✅ Issue #15: Complete User Management (8-10 hrs)
4. ✅ Close Issue #13 as completed

### Sprint 2: Project Management Enhancement (8-12 hours)
1. ✅ Issue #21: Custom Workflow Builder (8-12 hrs)

### Sprint 3: Product Expansion
1. Planning: Plant API strategy (Issue #25)
2. Planning: Feature flags + billing (Issues #16, #17)
3. Execution based on plans

### Sprint 4: Advanced Features
1. Issue #12: Onboarding Flow (10-15 hrs)
2. Issue #10: Calendar System (30-40 hrs) - Multi-sprint

---

## Tech Stack Reference

### Backend
- **Laravel 10** - API framework
- **PHP 8.1+** - Server language
- **MySQL 8.0** - Database
- **Redis** - Cache/queues
- **Sanctum** - SPA authentication
- **Stancl Tenancy** - Multi-tenancy
- **Spatie MediaLibrary** - File uploads

### Frontend
- **Next.js 13** (Pages Router) - React framework
- **React 18.2+** - UI library
- **Zustand** - State management
- **PrimeReact 8.5+** - UI components
- **React Hook Form** - Forms
- **SWR** - Auth user
- **React Query** - Server state
- **Axios** - HTTP client

---

## Key Patterns Used

### Backend Patterns
- **Repository Pattern** - Data access abstraction
- **Trait Composition** - Shared model behavior
- **Enum-Based Permissions** - `resource:action` format
- **Polymorphic Relationships** - Notes, media, service logs
- **Observer Pattern** - Model lifecycle hooks

### Frontend Patterns
- **Zustand Stores** - Persisted state (tenant, settings, auth)
- **Controller Pattern** - React Hook Form wrappers
- **Service Layer** - API abstraction
- **Restrict Component** - Permission-based UI gating

---

## Critical Architectural Decisions

### Multi-Tenancy
- **Single-DB** with `tenant_id` column (NOT separate databases)
- **X-Tenant header** for tenant resolution
- **BelongsToTenant trait** auto-scopes queries
- **User can belong to multiple tenants** with different roles per tenant

### Authentication
- **Sanctum** for SPA token authentication
- **Middleware:** `auth:sanctum` → `InitializeTenancyByRequestData`
- **Frontend:** axios interceptor adds X-Tenant header automatically

### Permissions
- **Format:** `resource:action` (e.g., `inventory:create`)
- **Roles have permissions** (stored in JSON on pivot table)
- **Route protection:** `middleware('user-can:permission:name')`
- **Frontend gating:** `<Restrict permission="...">` component

---

## Gotchas & Common Issues

### Backend
- All models must use `BelongsToTenant` trait for tenant isolation
- ULIDs (not integers) for primary keys - use `HasUlids` trait
- Alpine Linux in Docker uses `ash` shell, not `bash`
- Images must be base64 encoded for upload (use helper function)

### Frontend
- Pages Router (NOT App Router) - use `pages/` directory
- Must call `csrf()` before login/register
- Tenant switch requires page refresh (Router.push('/'))
- Use localhost (not 127.0.0.1) for cookies

### Docker
- MySQL accessible on port 33062 (not 3306)
- MinIO for S3-compatible local storage
- Redis for cache/queues

---

## Need Help?

- **Documentation:** `/CLAUDE.md` - Quick reference guide
- **Architecture Details:** `/research/RESEARCH.md` - Design philosophy
- **Plans Directory:** `/plans/` - This directory, detailed implementation guides

---

## Contributing

When completing an issue:
1. Follow the plan's implementation steps
2. Check off completed items
3. Run verification checklist
4. Update this README if plan deviated significantly
5. Close GitHub issue when done

---

**Last Updated:** 2026-02-13
**Total Plans:** 9 issues
**Estimated Total Time:** 100-150 hours across all issues
**Recommended Start:** Issue #19 (Global Error Boundary)
