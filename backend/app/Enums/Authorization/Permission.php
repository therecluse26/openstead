<?php

namespace App\Enums\Authorization;

enum Permission: string
{
        // Inventory Permissions
    case InventoryList = 'inventory:list';
    case InventoryRead = 'inventory:read';
    case InventoryCreate = 'inventory:create';
    case InventoryUpdate = 'inventory:update';
    case InventoryDelete = 'inventory:delete';

        // Note Permissions
    case NoteList = 'note:list';
    case NoteRead = 'note:read';
    case NoteCreate = 'note:create';
    case NoteUpdate = 'note:update';
    case NoteDelete = 'note:delete';

        // Service Permissions
    case ServiceList = 'service:list';
    case ServiceRead = 'service:read';
    case ServiceCreate = 'service:create';
    case ServiceUpdate = 'service:update';
    case ServiceDelete = 'service:delete';

        // Project Permissions
    case ProjectList = 'project:list';
    case ProjectRead = 'project:read';
    case ProjectCreate = 'project:create';
    case ProjectUpdate = 'project:update';
    case ProjectDelete = 'project:delete';

        // Project Item Permissions
    case ProjectItemList = 'project-item:list';
    case ProjectItemRead = 'project-item:read';
    case ProjectItemCreate = 'project-item:create';
    case ProjectItemUpdate = 'project-item:update';
    case ProjectItemDelete = 'project-item:delete';

        // User Permissions
    case UserList = 'user:list';
    case UserRead = 'user:read';
    case UserCreate = 'user:create';
    case UserUpdate = 'user:update';
    case UserDelete = 'user:delete';

        // Tenant/Homestead Permissions
    case TenantList = 'tenant:list';
    case TenantRead = 'tenant:read';
    case TenantCreate = 'tenant:create';
    case TenantUpdate = 'tenant:update';
    case TenantDelete = 'tenant:delete';
    case TenantAssignUser = 'tenant:assign-user';

    public function label(): string
    {
        return match ($this) {
            self::InventoryList => 'List Inventory',
            self::InventoryRead => 'Read Inventory Details',
            self::InventoryCreate => 'Create Inventory',
            self::InventoryUpdate => 'Update Inventory',
            self::InventoryDelete => 'Delete Inventory',
            self::ProjectList => 'List Projects',
            self::ProjectRead => 'Read Project Details',
            self::ProjectCreate => 'Create Projects',
            self::ProjectUpdate => 'Update Projects',
            self::ProjectDelete => 'Delete Projects',
            self::ProjectItemList => 'List Project Items',
            self::ProjectItemRead => 'Read Project Item Details',
            self::ProjectItemCreate => 'Create Project Items',
            self::ProjectItemUpdate => 'Update Project Items',
            self::ProjectItemDelete => 'Delete Project Items',
            self::UserList => 'List Users',
            self::UserRead => 'Read User Details',
            self::UserCreate => 'Create Users',
            self::UserUpdate => 'Update Users',
            self::UserDelete => 'Delete Users',
            self::NoteList => 'List Notes',
            self::NoteRead => 'Read Note Details',
            self::NoteCreate => 'Create Notes',
            self::NoteUpdate => 'Update Notes',
            self::NoteDelete => 'Delete Notes',
            self::ServiceList => 'List Services',
            self::ServiceRead => 'Read Service Details',
            self::ServiceCreate => 'Create Services',
            self::ServiceUpdate => 'Update Services',
            self::ServiceDelete => 'Delete Services',
            self::TenantList => 'List Homesteads',
            self::TenantRead => 'Read Tenant Details',
            self::TenantCreate => 'Create Homesteads',
            self::TenantUpdate => 'Update Homesteads',
            self::TenantDelete => 'Delete Homesteads',
            self::TenantAssignUser => 'Assign Users to Homesteads',
            default => $this->value,
        };
    }

    public function toDisplay(): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }
}
