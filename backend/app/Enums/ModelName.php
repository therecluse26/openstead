<?php

namespace App\Enums;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use App\Traits\FilterableEnum;

enum ModelName: string
{
	use FilterableEnum;

	case Equipment = 'equipment';
	case Livestock = 'livestock';
	case Seed = 'seed';

	public function class(): string
	{
		return match ($this) {
			self::Equipment => Equipment::class,
			self::Livestock => Livestock::class,
			self::Seed => Seed::class,
		};
	}
}
