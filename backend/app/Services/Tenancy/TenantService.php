<?php

namespace App\Services\Tenancy;

use App\Models\Tenant;
use App\Models\User;
use App\Repositories\Tenancy\TenantRepository;
use Stancl\Tenancy\Database\Models\Domain;

class TenantService {

    private TenantRepository $repo;

    // Memoized repository method
    public function repository() {
        if (!isset($this->repo)) {
            $this->repo = new TenantRepository();
        }
        return $this->repo;
    }
   

    public function createTenant(array $data, User $owner = null): Tenant
    {
        $tenant = $this->repository()->createTenant($data);

        if ($owner) {
            $this->addUsersToTenant($tenant, [$owner->id], ["admin"]);
        }

        return $tenant;
    }

    public function addUsersToTenant(Tenant $tenant, array $users, array $roles = ["viewer"], array|null $permissions = null): array
    {
        return $this->repository()->addUsersToTenant($tenant, $users, $roles, $permissions);
    }

    public function addDomainToTenant(Tenant $tenant, string $domain): Domain
    {
        return $this->repository()->addDomainToTenant($tenant, $domain);
    }
}