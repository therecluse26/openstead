<?php

namespace App\Enums;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use App\Traits\FilterableEnum;

enum InventoryType: string
{
	use FilterableEnum;

	case Equipment = Equipment::class;
	case Livestock = Livestock::class;
	case Seed = Seed::class;

	public static function getTypes(): array
	{
		return self::cases();
	}


}
