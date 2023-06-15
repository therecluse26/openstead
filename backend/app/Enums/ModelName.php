<?php

namespace App\Enums;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use App\Models\Inventory\PantryItem;
use App\Models\Note;
use App\Traits\FilterableEnum;

enum ModelName: string
{
	use FilterableEnum;

	case Equipment = 'equipment';
	case Livestock = 'livestock';
	case Seed = 'seed';
	case Note = 'note';
	case PantryItem = 'pantry_item';

	public function class(): string
	{
		return match ($this) {
			self::Equipment => Equipment::class,
			self::Livestock => Livestock::class,
			self::Seed => Seed::class,
			self::Note => Note::class,
			self::PantryItem => PantryItem::class
		};
	}
}
