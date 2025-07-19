<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase;

    public function users()
    {
        return $this->belongsToMany(User::class, 'tenant_users')
            ->using(TenantUser::class)
            ->withPivot(['roles', 'permissions']);
    }
}
