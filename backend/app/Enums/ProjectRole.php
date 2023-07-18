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
}
