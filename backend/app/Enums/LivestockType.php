<?php
namespace App\Enums;

enum LivestockType: string
{
	case Bird = 'bird';
	case Cattle = 'cattle';
	case Swine = 'swine';
	case Sheep = 'sheep';
	case Goat = 'goat';
	case Horse = 'horse';
	case Other = 'other';

	public function formatted(): string
	{
		return match($this)
		{
			self::Bird => 'Bird/Poultry',
			self::Cattle => 'Cattle',
			self::Swine => 'Pig/Swine',
			self::Sheep => 'Sheep',
			self::Goat => 'Goat',
			self::Horse => 'Horse/Equine',
			self::Other => 'Other'
		};
	}

	public static function getTypes(): array
	{
		return self::cases();
	}
}
