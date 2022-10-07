<?php

namespace App\Enums;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;

enum InventoryType: string
{
	case Equipment = Equipment::class;
	case Livestock = Livestock::class;

	public static function getTypes(): array
	{
		return self::cases();
	}
}
