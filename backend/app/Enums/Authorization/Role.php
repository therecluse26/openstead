<?php

namespace App\Enums\Authorization;

enum Role: string
{  
    case Viewer = 'viewer'; // Viewer is a read-only role
    case User = 'user'; // User is a read-write role
    case Manager = 'manager';  // Manager is a read-write-delete role
    case Administrator = 'admin'; // Administrator is a role with all permissions

    public function label(): string
    {
        return match ($this) {
            self::Viewer => 'Viewer',
            self::User => 'User',
            self::Manager => 'Manager',
            self::Administrator => 'Administrator',
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            // Viewer has read-only permissions
            self::Viewer => [
                // Inventory Permissions
                Permission::InventoryList,
                Permission::InventoryRead,
                // Project Permissions
                Permission::ProjectList,
                Permission::ProjectRead,
                Permission::ProjectItemList,
                Permission::ProjectItemRead,
                // User Permissions
                Permission::UserList,
                Permission::UserRead
            ],
            // User inherits all permissions from Viewer role
            self::User => [
                ...self::Viewer->permissions(),
                // Inventory Permissions
                Permission::InventoryCreate,
                Permission::InventoryUpdate,
                // Project Permissions
                Permission::ProjectItemCreate,
                Permission::ProjectItemUpdate,
            ],
            // Manager inherits all permissions from User role
            self::Manager => [
                ...self::User->permissions(),
                // Inventory Permissions
                Permission::InventoryDelete,
                Permission::ProjectCreate,
                Permission::ProjectUpdate,
                Permission::ProjectDelete,
                Permission::ProjectItemDelete
            ],
            // Administrator has all permissions
            self::Administrator => Permission::cases(),
        };
    }
}
