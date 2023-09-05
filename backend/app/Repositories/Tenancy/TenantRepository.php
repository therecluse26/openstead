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

    public function addDomainToTenant(Tenant $tenant, string $domain): Domain
    {
        return $tenant->domains()->create([
            'domain' => $domain,
        ]);
    }
}