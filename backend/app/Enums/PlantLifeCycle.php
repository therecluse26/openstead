<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PlantLifeCycle: string
{
	use FilterableEnum;

	case Annual = 'annual';
	case Biennial = 'biennial';
	case Perennial = 'perennial';

	public function label(): string
	{
		return match ($this) {
			self::Annual => 'Annual',
			self::Biennial => 'Biennial',
			self::Perennial => 'Perennial',
		};
	}

	public function description(): string
	{
		return match ($this) {
			self::Annual => 'Plant performs entire life cycle from seed to flower in a single year',
			self::Biennial => 'Plant performs entire life cycle from seed to flower in two years',
			self::Perennial => 'Plant flowers many times over the course of many years'
		};
	}

}
