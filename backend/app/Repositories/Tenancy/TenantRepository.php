<?php

namespace App\Repositories\Tenancy;

use App\Models\Tenant;

class TenantRepository
{

    public function getFirst(): Tenant
    {
        return Tenant::firstOrFail();
    }

    public function getById(string $id): Tenant
    {
        return Tenant::findOrFail($id);
    }

    public function createTenant(array $data): Tenant
    {
        return Tenant::create([
            'name' => $data['name'],
            'plan' => $data['plan'] ?? 'free',
        ]);
    }

    public function addUsersToTenant(string $tenantId, array $users, array $roles = ["viewer"], array|null $permissions = null): array
    {
        $tenant = $this->getById($tenantId);

        $tenantUsers = collect();

        foreach ($users as $user) {
            $tenantUsers->push([
                'user_id' => $user,
                'tenant_id' => $tenant->id,
                'roles' => $roles,
                'permissions' => $permissions,
            ]);
        }

        return $tenant->users()->syncWithoutDetaching($tenantUsers);
    }
}
