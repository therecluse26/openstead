<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum KitchenUnit: string
{
	use FilterableEnum;

	case Tsp = 'teaspoon';
	case Tbsp = 'tablespoon';
	case FluidOz = 'fluidoz';
	case Oz = 'oz';
	case Gill = 'gill';
	case Cup = 'cup';
	case Pint = 'pint';
	case Quart = 'quart';
	case Gallon = 'gallon';
	case None = 'none';

	/**
	 * Readable unit label
	 *
	 * @return string
	 */
	public function label(): string
	{
		return match ($this) {
			self::Tsp => 'Teaspoon',
			self::Tbsp => 'Tablespoon',
			self::FluidOz => 'Fluid Ounce',
			self::Oz => 'Ounce',
			self::Gill => 'Gill',
			self::Cup => 'Cup',
			self::Pint => 'Pint',
			self::Quart => 'Quart',
			self::Gallon => 'Gallon',
			self::None => '',
		};
	}

	/**
	 * Conversion rates (in # of teaspoons)
	 *
	 * @return int
	 */
	public function conversionRate(): int
	{
		return match ($this) {
			self::Tsp => 1,
			self::Tbsp => 3,
			self::FluidOz => 6,
			self::Oz => 6,
			self::Gill => 24,
			self::Cup => 48,
			self::Pint => 96,
			self::Quart => 192,
			self::Gallon => 768,
			self::None => 0,
		};
	}

	/**
	 * Converts value from one unit to another
	 *
	 * Formula: ((originalValue * baseUnitRate) * originalUnitRate) / toUnitConversionRate
	 *
	 * @param KitchenUnit $toUnit
	 * @param float $originalValue
	 * @return float
	 */
	public function convert(self $toUnit, float $originalValue): float
	{
		return (($originalValue * self::Tsp->conversionRate()) * $this->conversionRate()) / $toUnit->conversionRate();
	}

}
