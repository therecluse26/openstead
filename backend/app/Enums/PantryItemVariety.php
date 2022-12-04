<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PantryItemVariety: string
{
	use FilterableEnum;

	case Ready = 'ready';
	case Ingredient = 'ingredient';
	case Produce = 'produce';

	public function label(): string
	{
		return match ($this) {
			self::Ready => 'Ready to Eat',
			self::Ingredient => 'Ingredient',
			self::Produce => 'Fresh Produce',
		};
	}
}
