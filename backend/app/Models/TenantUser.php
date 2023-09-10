<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Casts\PermissionCollection;
use App\Casts\RoleCollection;

class TenantUser extends Pivot
{
    protected $table = 'tenant_users';

    // Add fillable fields
    protected $fillable = [
        'tenant_id',
        'user_id',
        'roles',
        'permissions'
    ];

    // Add casts
    protected $casts = [
        'roles' => RoleCollection::class,
        'permissions' => PermissionCollection::class,
    ];

    protected $hidden = ['id'];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}