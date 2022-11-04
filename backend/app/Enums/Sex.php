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

	public function label(): string
	{
		return match ($this) {
			self::Male => 'Male️',
			self::Female => 'Female',
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Male => '♂️',
			self::Female => '♀️',
		};
	}

	public function toFilter(): array
	{
		return ['key' => $this, 'label' => $this->label(), 'icon' => $this->icon()];
	}
}
