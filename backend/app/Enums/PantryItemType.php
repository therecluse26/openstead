<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PantryItemType: string
{
	use FilterableEnum;

	public const VARIETY_GROUP = 'edible';

	case Other = 'pantry.other';
	case Dairy = 'pantry.dairy';
	case Egg = 'pantry.egg';
	case Seasoning = 'pantry.seasoning';
	case Grain = 'pantry.grain';
	case Pasta = 'pantry.pasta';
	case Junk = 'pantry.junk';

	public function label(): string
	{
		return match ($this) {
			self::Other => 'Other Pantry Item',
			self::Dairy => 'Dairy',
			self::Egg => 'Egg',
			self::Seasoning => 'Seasoning/Condiment',
			self::Grain => 'Grain',
			self::Pasta => 'Pasta',
			self::Junk => 'Junk Food'
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Other => '🪨',
			self::Dairy => '🧀',
			self::Egg => '🥚',
			self::Seasoning => '🧂',
			self::Grain => '🌾',
			self::Pasta => '🍝',
			self::Junk => '🍭'
		};
	}
}
