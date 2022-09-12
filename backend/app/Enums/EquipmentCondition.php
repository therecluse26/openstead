<?php
namespace App\Enums;

enum EquipmentCondition: int
{
	case Broken = 1;
	case Poor = 2;
	case Fair = 3;
	case Good = 4;
	case Excellent = 5;

	public function toString(): string
	{
		return match($this)
		{
			self::Broken => 'Broken',
			self::Poor => 'Poor',
			self::Fair => 'Fair',
			self::Good => 'Good',
			self::Excellent => 'Excellent',
		};
	}
}
