<?php

namespace App\Services\Inventory;

use App\Enums\EquipmentType;

class EquipmentService
{
	public static function getEquipmentTypes()
	{
		return EquipmentType::getTypes();
	}
}