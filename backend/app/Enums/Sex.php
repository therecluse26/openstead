<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum Sex: string
{
	use FilterableEnum;

	case Male = 'male';
	case Female = 'female';

	public function getParentValue(): string
	{
		return match ($this) {
			self::Male => 'father',
			self::Female => 'mother',
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Male => '♂️',
			self::Female => '♀️',
		};
	}
}
