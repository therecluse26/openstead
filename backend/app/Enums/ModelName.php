<?php

namespace App\Enums;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use App\Models\Inventory\PantryItem;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectItem;
use App\Models\Note;
use App\Models\User;
use App\Traits\FilterableEnum;

enum ModelName: string
{
	use FilterableEnum;

	case Equipment = 'equipment';
	case Livestock = 'livestock';
	case Seed = 'seed';
	case Note = 'note';
	case PantryItem = 'pantry_item';
	case Project = 'project';
	case ProjectItem = 'project_item';
	case User = 'user';

	public function class(): string
	{
		return match ($this) {
			self::Equipment => Equipment::class,
			self::Livestock => Livestock::class,
			self::Seed => Seed::class,
			self::Note => Note::class,
			self::PantryItem => PantryItem::class,
			self::Project => Project::class,
			self::ProjectItem => ProjectItem::class,
			self::User => User::class,
		};
	}
}
