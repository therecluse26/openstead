<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum EquipmentType: string
{
	use FilterableEnum;

	case Hand = 'hand';
	case Power = 'power';
	case Heavy = 'heavy';
	case Air = 'air';
	case SmallEngine = 'smallengine';
	case Machining = 'machining';
	case Other = 'other';

	public function label(): string
	{
		return match ($this) {
			self::Hand => 'Hand Tool',
			self::Power => 'Power Tool',
			self::Heavy => 'Heavy Equipment',
			self::Air => 'Air Tool',
			self::SmallEngine => 'Small Engine',
			self::Machining => 'Machining Tool',
			self::Other => 'Other'
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Hand => '🔨',
			self::Power => '🔌',
			self::Heavy => '🚜',
			self::Air => '💨',
			self::SmallEngine => '⛽',
			self::Machining => '🔩',
			self::Other => '🤖'
		};
	}

	public function description(): string
	{
		return match ($this) {
			self::Hand => 'Unpowered tools to be used by hand',
			self::Power => 'Tools powered by electricity',
			self::Heavy => 'Equipment meant for heavy labor',
			self::Air => 'Pneumatic (air-powered) tools',
			self::SmallEngine => 'Tools powered by a two-cycle or other small engine',
			self::Machining => 'Machine shop and metalworking tools',
			self::Other => 'Other tools not categorized'
		};
	}

	public function examples(): string
	{
		return match ($this) {
			self::Hand => 'Hammer, shovel, screwdriver, pliers, wrench',
			self::Power => 'Drill, circular saw, table saw, sander',
			self::Heavy => 'Tractor, skidsteer, backhoe, trencher, bulldozer, forklift',
			self::Air => 'Impact wrench, nail gun, paint sprayer, impact hammer',
			self::SmallEngine => 'Chainsaw, tiller, lawnmower, weed wacker',
			self::Machining => 'Drill press, lathe, caliper, cnc machine',
			self::Other => 'Other'
		};
	}
}
