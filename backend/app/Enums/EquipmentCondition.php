<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum EquipmentCondition: int
{
	use FilterableEnum;

	case Broken = 1;
	case Poor = 2;
	case Fair = 3;
	case Good = 4;
	case Excellent = 5;

	public function toString(): string
	{
		return match ($this) {
			self::Broken => 'Broken',
			self::Poor => 'Poor',
			self::Fair => 'Fair',
			self::Good => 'Good',
			self::Excellent => 'Excellent',
		};
	}

	public function label(): string
	{
		return $this->toString();
	}
}
