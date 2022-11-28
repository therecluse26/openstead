<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum ServiceType: string
{
	use FilterableEnum;

	case Veterinary = 'vet';
	case Mechanic = 'mechanic';
	case Construction = 'construction';
	case Labor = 'labor';
	case Consulting = 'consulting';
	case Maintenance = 'maintenance';
	case Other = 'other';

	public function label(): string
	{
		return match ($this) {
			self::Veterinary => 'Veterinary Service',
			self::Mechanic => 'Mechanic Service',
			self::Construction => 'Construction/Repair Service',
			self::Labor => 'Labor',
			self::Consulting => 'Consultation',
			self::Maintenance => 'Maintenance',
			self::Other => 'Other Service',
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Veterinary => '💉',
			self::Mechanic => '🔧',
			self::Construction => '🚧',
			self::Labor => '💪',
			self::Consulting => '🧐',
			self::Maintenance => '🚜',
			self::Other => '❔',
		};
	}
}
