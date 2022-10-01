<?php

namespace App\Services\Inventory;

use App\Enums\EquipmentType;

class EquipmentService
{
	public static function getTypes()
	{
		return EquipmentType::getTypes();
	}
}