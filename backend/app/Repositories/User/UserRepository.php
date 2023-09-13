<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Contracts\Repository;
use App\Models\Tenant;
use App\Models\TenantUser;
use App\Repositories\Tenancy\TenantRepository;
use App\Traits\AddMedia;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserRepository implements Repository
{
    use AddMedia;

    public function getAuthenticatedUser(): ?User
    {
        return auth()->user();
    }

    public function index()
    {
        return TenantUser::where('tenant_id', tenant()->id)->get()->map(function ($tenantUser) {
            return $tenantUser->user;
        });
    }

    public function getById(string $id): User
    {
        return TenantUser::where('user_id', $id)->where('tenant_id', tenant()->id)->firstOrFail()->user;
    }

    public function checkUserTenantMembership(string $userId, string $tenantId): bool
    {
        return TenantUser::where('user_id', $userId)->where('tenant_id', $tenantId)->exists();
    }

    public function create(array $attributes, string $tenantId = null): User
    {
        $tenantRepo = new TenantRepository();

        $user = User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => Hash::make($attributes['password']),
        ]);

        $tenant = $tenantId ? $tenantRepo->getById($tenantId) : tenant();

        $this->updateRoles($user, $tenant, $attributes['roles'] ?? null);

        $this->updatePermissions($user, $tenant, $attributes['permissions'] ?? null);

        if (isset($attributes['images']) && is_array($attributes['images']) && count($attributes['images']) > 0) {
            $this->addOrReplaceImagesBase64($user, $attributes['images']);
        }

        return $user;
    }

    public function updateCurrentTenant(string $id, string $tenantId): User
    {
        $tenantRepo = new TenantRepository();

        $user = $this->getById($id);
        $tenant = $tenantRepo->getById($tenantId);

        $user->current_tenant_id = $tenant->id;
        $user->save();

        return $user;
    }

    private function updateRoles(User $user, Tenant $tenant, $roles = null)
    {
        if (isset($roles)) {
            $tenant->users()->updateExistingPivot($user->id, [
                'roles' => $roles
            ]);
        }
    }

    private function updatePermissions(User $user, Tenant $tenant, $permissions = null)
    {
        if (isset($permissions)) {
            $tenant->users()->updateExistingPivot($user->id, [
                'permissions' => $permissions
            ]);
        }
    }

    public function update(string $id, array $attributes, string $tenantId = null): User
    {
        $tenantRepo = new TenantRepository();

        $user = $this->getById($id);
        if ($user->name !== $attributes['name']) {
            $user->name = $attributes['name'];
        }

        if ($user->email !== $attributes['email']) {
            $user->email = $attributes['email'];
        }

        if (isset($attributes['password'])) {
            $user->password = Hash::make($attributes['password']);
        }

        $tenant = $tenantId ? $tenantRepo->getById($tenantId) : tenant();

        $this->updateRoles($user, $tenant, $attributes['roles'] ?? null);

        $this->updatePermissions($user, $tenant, $attributes['permissions'] ?? null);

        $user->save();

        if (isset($attributes['images']) && is_array($attributes['images']) && count($attributes['images']) > 0) {
            $this->addOrReplaceImagesBase64($user, $attributes['images']);
        }

        return $user;
    }

    public function delete(string $id): bool
    {
        return $this->getById($id)->delete();
    }

    public function count(): int
    {
        return User::count();
    }

    public function all(): Collection
    {
        return User::all();
    }

    public function getModel(): User
    {
        return new User();
    }

    public function __call(string $method, array $arguments): mixed
    {
        return $this->getModel()->$method(...$arguments);
    }
}
