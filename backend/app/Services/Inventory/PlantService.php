<?php

namespace App\Services\Inventory;

use App\Enums\PlantType;
use Illuminate\Support\Collection;

class PlantService
{
	public static function getTypes(): array
	{
		return PlantType::getTypes();
	}

	public static function getFormattedTypes(): Collection
	{
		return collect(PlantType::getTypes())->map(function ($type) {
			return $type->toFilter();
		});
	}
}