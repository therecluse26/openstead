<?php

namespace App\Repositories\Tenancy;

use App\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class TenantRepository {

    public function createTenant(array $data): Tenant
     {
        return Tenant::create([
            'name' => $data['name'],
            'plan' => $data['plan'] ?? 'free',
        ]);
    }

    public function addUsersToTenant(Tenant $tenant, array $users, array $roles = ["viewer"], array|null $permissions = null): array
    {
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

    public function addDomainToTenant(Tenant $tenant, string $domain): Domain
    {
        return $tenant->domains()->create([
            'domain' => $domain,
        ]);
    }
}