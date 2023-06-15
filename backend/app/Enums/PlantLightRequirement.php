<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PlantLightRequirement: string
{
	use FilterableEnum;

	case FullSun = 'full_sun';
	case PartialSun = 'partial_sun';
	case FullShade = 'full_shade';
	case PartialShade = 'partial_shade';

	public function label(): string
	{
		return match ($this) {
			self::FullSun => 'Full Sun',
			self::PartialSun => 'Partial Sun',
			self::FullShade => 'Full Shade',
			self::PartialShade => 'Partial Shade',
		};
	}

	public function description(): string
	{
		return match ($this) {
			self::FullSun => 'Plant requires full sunlight 8-10 hours',
			self::PartialSun => 'Plant requires partial sunlight 6-8 hours',
			self::FullShade => 'Plant requires sunlight for at least 3 shaded hours',
			self::PartialShade => 'Plant requires partial sunlight for 6-8 shaded hours',
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::FullSun => '☀️',
			self::PartialSun => '🌤️',
			self::FullShade => '☁️',
			self::PartialShade => '⛅'
		};
	}

}
