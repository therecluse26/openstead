<?php

namespace App\Services\Inventory;

use App\Enums\LivestockType;
use Illuminate\Support\Collection;

class LivestockService
{
	public static function getTypes(): array
	{
		return LivestockType::getTypes();
	}

	public static function getFormattedTypes(): Collection
	{
		return collect(LivestockType::getTypes())->map(function ($type) {
			return $type->toFilter();
		});
	}
}