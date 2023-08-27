<?php

namespace App\Casts;

use App\Enums\Authorization\Role;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class RoleCollection implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes)
    {
        if(is_null($value)) return collect([]);
        
        return collect(json_decode($value, true))
            ->map(function($role) {
                return Role::from($role);
            });
    }

    public function set(Model $model, string $key, mixed $value, array $attributes)
    {
        return json_encode($value->map(function($role) {
            return $role->value;
        }));
    }
}