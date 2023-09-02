<?php
namespace App\Services\Authorization;

use App\Models\User;
use Exception;

class Check
{
    public static function userCan(string $permission, User $user = null): bool
    {
        $user = $user ?? auth()->user();
        return $user?->allPermissions->contains($permission);
    }

    public static function userCanAny(array $permissions, User $user = null): bool
    {
        $user = $user ?? auth()->user();
        return $user?->allPermissions->intersect($permissions)->isNotEmpty();
    }

    public static function userCanAll(array $permissions, User $user = null): bool
    {
        $user = $user ?? auth()->user();
        return $user?->allPermissions->intersect($permissions)->count() === count($permissions);
    }

    public static function can(string|array $permission, bool $all = false, User $user = null): void
    {
        if(is_array($permission, $user)) {
            if($all){
                if(!self::userCanAll($permission, $user)) {
                    throw new Exception('Unauthorized');
                }
            }
            if(!self::userCanAny($permission)) {
                throw new Exception('Unauthorized');
            }
        } else {
            if(!self::userCan($permission, $user)) {
                throw new Exception('Unauthorized');
            }
        }
    }
    
}
