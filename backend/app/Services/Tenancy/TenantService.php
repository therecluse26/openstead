<?php

namespace App\Services\Tenancy;

use App\Models\Tenant;
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
   

    public function createTenant(array $data): Tenant
    {
        return $this->repository()->createTenant($data);
    }

    public function addDomainToTenant(Tenant $tenant, string $domain): Domain
    {
        return $this->repository()->addDomainToTenant($tenant, $domain);
    }
}