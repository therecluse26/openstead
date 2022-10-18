<?php

namespace App\Services\Inventory;

use App\Enums\PlantType;
use Illuminate\Support\Collection;

class PlantService
{
	public static function getTypes(): array
	{
		return PlantType::cases();
	}

	public static function getFormattedTypes(): Collection
	{
		return collect(PlantType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}
}