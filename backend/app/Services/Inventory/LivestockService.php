<?php

namespace App\Services\Inventory;

use App\Enums\LivestockType;

class LivestockService
{
	public static function getTypes()
	{
		return LivestockType::getTypes();
	}
}