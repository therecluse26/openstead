<?php

namespace App\Services\Inventory;

use App\Enums\LivestockType;

class LivestockService
{
	public static function getEquipmentTypes()
	{
		return LivestockType::getTypes();
	}
}