<?php
namespace App\Http\Controllers\Authorization;

use App\Enums\Authorization\Permission;
use App\Enums\Authorization\Role;
use App\Http\Controllers\Controller;
use App\Resources\Authorization\Permission\PermissionListResource;
use App\Resources\Authorization\Role\RoleListResource;

final class AuthorizationController extends Controller
{
    public function allPermissions()
    {
        return response()->json(
            PermissionListResource::collection(Permission::cases()), 
        200);
    }

    public function allRoles()
    {
        return response()->json(RoleListResource::collection(Role::cases()), 200);
    }

    public function allRolesAndPermissions()
    {
        return response()->json([
            'roles' => RoleListResource::collection(Role::cases()),
            'permissions' =>  PermissionListResource::collection(Permission::cases()),
        ], 200);
    }
}