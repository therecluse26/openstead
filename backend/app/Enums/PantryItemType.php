<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PantryItemType: string
{
	use FilterableEnum;

	public const VARIETY_GROUP = 'edible';

	case Other = 'other';
	case Dairy = 'dairy';
	case Egg = 'egg';
	case Seasoning = 'seasoning';
	case Grain = 'grain';
	case Pasta = 'pasta';
	case Junk = 'junk';

	public function label(): string
	{
		return match ($this) {
			self::Other => 'Other',
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
