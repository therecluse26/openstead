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
	case Fish = 'fish';
	case Other = 'other';

	public function label(): string
	{
		return match ($this) {
			self::Bird => 'Bird/Poultry',
			self::Cattle => 'Cattle',
			self::Swine => 'Pig/Swine',
			self::Sheep => 'Sheep',
			self::Goat => 'Goat',
			self::Horse => 'Horse/Equine',
			self::Fish => 'Fish',
			self::Other => 'Other'
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Bird => '🐔',
			self::Cattle => '🐮',
			self::Swine => '🐷',
			self::Sheep => '🐑',
			self::Goat => '🐐',
			self::Horse => '🐴',
			self::Fish => '🐟',
			self::Other => '🐸',
		};
	}

	public function formatted(): array
	{
		return ['key' => $this, 'icon' => $this->icon(), 'label' => $this->label()];
	}

	public static function getTypes(): array
	{
		return self::cases();
	}
}
