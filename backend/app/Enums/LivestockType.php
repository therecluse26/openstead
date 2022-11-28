<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum LivestockType: string
{
	use FilterableEnum;

	case Bird = 'bird';
	case Cattle = 'cattle';
	case Swine = 'swine';
	case Sheep = 'sheep';
	case Goat = 'goat';
	case Equine = 'equine';
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
			self::Equine => 'Horse/Equine',
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
			self::Equine => '🐴',
			self::Fish => '🐟',
			self::Other => '🐸',
		};
	}

	public function examples(): ?string
	{
		return match ($this) {
			self::Bird => 'Chicken, duck, goose, turkey, guinea fowl, emu, rhea, owl',
			self::Cattle => 'Angus, brahman, jersey, longhorn, ox, zebu',
			self::Swine => 'Berkshire, duroc, kunekune, hamphire, landrace',
			self::Sheep => 'Lincoln, hampshire, suffolk, turcana',
			self::Goat => 'Nubian, kiko, nigerian dwarf, pygmy, angora',
			self::Equine => 'American quarter, arabian, thoroughbred, morgan, warmblood',
			self::Fish => 'Carp, salmon, catfish, tilapia',
			self::Other => 'Frog, elephant, martian',
		};
	}
	
}
