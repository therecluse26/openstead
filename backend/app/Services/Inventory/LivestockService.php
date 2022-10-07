<?php

namespace App\Services\Inventory;

use App\Enums\LivestockType;

class LivestockService
{
	public static function getTypes()
	{
		return LivestockType::getTypes();
	}

	public static function getFormattedTypes()
	{
		return collect(LivestockType::getTypes())->map(function ($type) {
			return $type->formatted();
		});
	}
}