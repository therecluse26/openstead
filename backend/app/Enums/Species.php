<?php

namespace App\Enums;

enum Species: string
{
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
