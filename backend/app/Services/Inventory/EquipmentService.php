<?php

namespace App\Services\Inventory;

use App\Enums\EquipmentType;
use Illuminate\Support\Collection;

class EquipmentService
{
	public static function getFormattedTypes(): Collection
	{
		return collect(EquipmentType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}
}