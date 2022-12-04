<?php

namespace App\Enums;

use App\Traits\FilterableEnum;
use Enum;

enum PantryItemType: string
{
	use FilterableEnum;

	case Other = 'other';
	case Canned = 'canned';
	case Ingredient = 'ingredient';
	case Condiment = 'condiment';
	case Produce = 'produce';
	case Meat = 'meat';
	case Spice = 'spice';
	case Grain = 'grain';
	case Pasta = 'pasta';

	public function label(): string
	{
		return match ($this) {
			self::Other => 'Other',
			self::Canned => 'Canned Food',
			self::Ingredient => 'Ingredient',
			self::Condiment => 'Condiment',
			self::Produce => 'Fresh Produce',
			self::Meat => 'Meat',
			self::Grain => 'Grain',
			self::Pasta => 'Pasta',
		};
	}

	public function getGroupTypes(): Enum|array
	{
		return match ($this) {
			self::Meat => LivestockType::cases(),
			self::Produce => PlantType::cases(),
		};
	}
}
