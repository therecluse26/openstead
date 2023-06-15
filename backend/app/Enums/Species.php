<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum Species: string
{
	use FilterableEnum;

	case Plant = 'plant';
	case Animal = 'animal';

	public function toString(): string
	{
		return match ($this) {
			self::Plant => 'Plant',
			self::Animal => 'Animal',
		};
	}
}
