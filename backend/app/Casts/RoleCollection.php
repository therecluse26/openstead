<?php

namespace App\Casts;

use App\Enums\Authorization\Role;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

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
        if(is_null($value)) return json_encode([]);

        if($value instanceof Role) {
            return json_encode([$value->value]);
        }

        if($value instanceof Collection) {
            return json_encode($value->map(function($role) {
                return $role->value;
            }));
        }

        if(is_array($value)) {
            return json_encode(collect($value)->map(function($role) {
                return Role::from($role)->value;
            }));
        }

        return $value;
    }
}