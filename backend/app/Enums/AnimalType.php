<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum AnimalType: string
{
	use FilterableEnum;

	public const VARIETY_GROUP = 'animal';

	case Bird = 'animal.bird';
	case Cattle = 'animal.cattle';
	case Swine = 'animal.swine';
	case Sheep = 'animal.sheep';
	case Goat = 'animal.goat';
	case Equine = 'animal.equine';
	case Fish = 'animal.fish';
	case Other = 'animal.other';

	public function group(): string
	{
		return self::VARIETY_GROUP;
	}


	public function label(): string
	{
		return match ($this) {
			self::Bird => 'Bird/Poultry',
			self::Cattle => 'Cattle',
			self::Equine => 'Horse/Equine',
			self::Fish => 'Fish',
			self::Goat => 'Goat',
			self::Sheep => 'Sheep',
			self::Swine => 'Pig/Swine',
			self::Other => 'Other Animal'
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
