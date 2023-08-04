<?php

namespace App\Enums;

enum ProjectRole: string
{
    case Admin = 'admin';
    case Contributor = 'contributor';
    case Viewer = 'viewer';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Contributor => 'Contributor',
            self::Viewer => 'Viewer'
        };
    }

    public function permissions(): array 
    {
        return match ($this) {
            self::Admin => [
                Permission::ProjectCreate,
                Permission::ProjectUpdate,
                Permission::ProjectDelete,
                Permission::ProjectViewAll,
                Permission::ProjectItemCreate,
                Permission::ProjectItemUpdate,
                Permission::ProjectItemDelete,
                Permission::ProjectItemViewAll,
            ],
            self::Contributor => [
                Permission::ProjectCreate,
                Permission::ProjectUpdate,
                Permission::ProjectViewAll,
                Permission::ProjectItemCreate,
                Permission::ProjectItemUpdate,
                Permission::ProjectItemViewAll,
            ],
            self::Viewer => [
                Permission::ProjectViewAll,
                Permission::ProjectItemViewAll,
            ]
        };
    }
}
