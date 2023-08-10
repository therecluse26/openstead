<?php

namespace App\Enums;

enum Permission: string
{
    case ProjectCreate = 'project:create';
    case ProjectUpdate = 'project:update';
    case ProjectDelete = 'project:delete';
    case ProjectViewAll = 'project:view-all';
    case ProjectItemCreate = 'project-item:create';
    case ProjectItemUpdate = 'project-item:update';
    case ProjectItemDelete = 'project-item:delete';
    case ProjectItemViewAll = 'project-item:view-all';
    
    case UserCreate = 'user:create';
    case UserUpdate = 'user:update';
    case UserDelete = 'user:delete';
    case UserView = 'user:view';
 

    public function label(): string
    {
        return match ($this) {
            self::ProjectCreate => 'Create Project',
            self::ProjectUpdate => 'Update Project',
            self::ProjectDelete => 'Delete Project',
            self::ProjectViewAll => 'View All Projects',
            self::ProjectItemCreate => 'Create Project Item',
            self::ProjectItemUpdate => 'Update Project Item',
            self::ProjectItemDelete => 'Delete Project Item',
            self::ProjectItemViewAll => 'View All Project Items',
            
            self::UserCreate => 'Create User',
            self::UserUpdate => 'Update User',
            self::UserDelete => 'Delete User',
            self::UserView => 'View User',
        };
    }
}
