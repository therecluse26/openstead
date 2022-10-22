<?php

namespace App\Services\Inventory;

use App\Enums\EquipmentType;
use App\Models\Inventory\Equipment;
use Illuminate\Support\Collection;

class EquipmentService
{
	public static function getFormattedTypes(): Collection
	{
		return collect(EquipmentType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getSimilar(Equipment $equipment): Collection
	{
		return Equipment::whereNot('id', $equipment->id)->where('type', $equipment->type)->inRandomOrder()->take(6)->get();
	}
}