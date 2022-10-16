<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum EquipmentType: string
{
	use FilterableEnum;

	case Hand = 'Hand Tool';
	case Power = 'Power Tool';
	case Heavy = 'Heavy Equipment';
	case Air = 'Pneumatic Tool';
	case TwoCycle = 'Two-Cycle';
	case Machining = 'Machining Tool';
	case Other = 'Other';

	public static function getTypes(): array
	{
		return self::cases();
	}
	
}
