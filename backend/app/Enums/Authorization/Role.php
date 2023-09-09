<?php

namespace App\Enums\Authorization;

enum Role: string
{  
    case Viewer = 'viewer';
    case Collaborator = 'collaborator';
    case Manager = 'manager'; 
    case Administrator = 'admin';
    case ProjectViewer = 'project-viewer';
    case ProjectManager = 'project-manager';
    case ProjectCollaborator = 'project-collaborator';
    case InventoryViewer = 'inventory-viewer';
    case InventoryManager = 'inventory-manager';
    case InventoryCollaborator = 'inventory-collaborator'; 
    case NoteViewer = 'note-viewer';
    case NoteManager = 'note-manager';
    case NoteCollaborator = 'note-collaborator';
    case ServiceViewer = 'service-viewer';
    case ServiceManager = 'service-manager';
    case ServiceCollaborator = 'service-collaborator';
    case UserViewer = 'user-viewer';
    case UserManager = 'user-manager';
    case UserCollaborator = 'user-collaborator';

    public function permissions(): array
    {
        return array_unique(match ($this) {

            //// Grouped Permissions ////

            // Administrator has all permissions
            self::Administrator => Permission::cases(),
            
            // Viewer has read-only permissions
            self::Viewer => [
                ...self::ProjectViewer->permissions(),
                ...self::InventoryViewer->permissions(),
                ...self::NoteViewer->permissions(),
                ...self::ServiceViewer->permissions(),
                ...self::UserViewer->permissions(),
            ],
            // User inherits all permissions from Viewer role
            self::Collaborator => [
                ...self::Viewer->permissions(),
                ...self::ProjectCollaborator->permissions(),
                ...self::InventoryCollaborator->permissions(),
                ...self::NoteCollaborator->permissions(),
                ...self::ServiceCollaborator->permissions(),
            ],
            // Manager inherits all permissions from Collaborator role
            self::Manager => [
                ...self::Collaborator->permissions(),
                ...self::ProjectManager->permissions(),
                ...self::InventoryManager->permissions(),
                ...self::NoteManager->permissions(),
                ...self::ServiceManager->permissions(),
                ...self::UserManager->permissions(),
            ],

            //// Specific Permissions ////

            // User Permissions
            self::UserViewer => [
                Permission::UserList,
                Permission::UserRead,
            ],
            self::UserCollaborator => [
                ...self::UserViewer->permissions(),
                Permission::UserCreate,
                Permission::UserUpdate,
            ],
            self::UserManager => [
                ...self::UserCollaborator->permissions(),
                Permission::UserDelete,
            ],
            
            // Project Permissions
            self::ProjectViewer => [
                ...self::UserViewer->permissions(),
                Permission::ProjectList,
                Permission::ProjectRead,
                Permission::ProjectItemList,
                Permission::ProjectItemRead,
            ],
            self::ProjectCollaborator => [
                ...self::ProjectViewer->permissions(),
                Permission::ProjectItemCreate,
                Permission::ProjectItemUpdate,
            ],
            self::ProjectManager => [
                ...self::ProjectCollaborator->permissions(),
                Permission::ProjectCreate,
                Permission::ProjectUpdate,
                Permission::ProjectDelete,
                Permission::ProjectItemDelete,
            ],

            // Inventory Permissions
            self::InventoryViewer => [
                ...self::UserViewer->permissions(),
                ...self::NoteViewer->permissions(),
                ...self::ServiceViewer->permissions(),
                Permission::InventoryList,
                Permission::InventoryRead,
            ],
            self::InventoryCollaborator => [
                ...self::InventoryViewer->permissions(),
                ...self::NoteCollaborator->permissions(),
                ...self::ServiceCollaborator->permissions(),
                Permission::InventoryCreate,
                Permission::InventoryUpdate,
            ],
            self::InventoryManager => [
                ...self::InventoryCollaborator->permissions(),
                ...self::NoteManager->permissions(),
                ...self::ServiceManager->permissions(),
                Permission::InventoryDelete,
            ],

            // Note Permissions
            self::NoteViewer => [
                Permission::NoteList,
                Permission::NoteRead,
            ],
            self::NoteCollaborator => [
                ...self::NoteViewer->permissions(),
                Permission::NoteCreate,
                Permission::NoteUpdate,
            ],
            self::NoteManager => [
                ...self::NoteCollaborator->permissions(),
                Permission::NoteDelete,
            ],

            // Service Permissions
            self::ServiceViewer => [
                Permission::ServiceList,
                Permission::ServiceRead,
            ],
            self::ServiceCollaborator => [
                ...self::ServiceViewer->permissions(),
                Permission::ServiceCreate,
                Permission::ServiceUpdate,
            ],
            self::ServiceManager => [
                ...self::ServiceCollaborator->permissions(),
                Permission::ServiceDelete,
            ],
        }, SORT_REGULAR);
    }

    public function label(): string
    {
        return match ($this) {
            self::Viewer => 'Viewer',
            self::Collaborator => 'Collaborator',
            self::Manager => 'Manager',
            self::Administrator => 'Administrator',
            self::ProjectViewer => 'Project Viewer',
            self::ProjectManager => 'Project Manager',
            self::ProjectCollaborator => 'Project Collaborator',
            self::InventoryViewer => 'Inventory Viewer',
            self::InventoryManager => 'Inventory Manager',
            self::InventoryCollaborator => 'Inventory Collaborator',
            self::NoteViewer => 'Note Viewer',
            self::NoteManager => 'Note Manager',
            self::NoteCollaborator => 'Note Collaborator',
            self::ServiceViewer => 'Service Viewer',
            self::ServiceManager => 'Service Manager',
            self::ServiceCollaborator => 'Service Collaborator',
            self::UserViewer => 'User Viewer',
            self::UserManager => 'User Manager',
            self::UserCollaborator => 'User Collaborator',
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
