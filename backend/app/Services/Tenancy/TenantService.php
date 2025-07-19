<?php

namespace App\Services\Tenancy;

use App\Models\Tenant;
use App\Models\User;
use App\Repositories\Tenancy\TenantRepository;

class TenantService
{

    private TenantRepository $repo;

    // Memoized repository method
    public function repository()
    {
        if (!isset($this->repo)) {
            $this->repo = new TenantRepository();
        }
        return $this->repo;
    }


    public function createTenant(array $data, User $owner = null): Tenant
    {
        $tenant = $this->repository()->createTenant($data);

        if ($owner) {
            $this->addUsersToTenant($tenant->id, [$owner->id], ["admin"]);
        }

        return $tenant;
    }

    public function addUsersToTenant(string $tenantId, array $users, array $roles = ["viewer"], array|null $permissions = null): array
    {
        return $this->repository()->addUsersToTenant($tenantId, $users, $roles, $permissions);
    }
}
