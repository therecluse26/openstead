<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PantryStorageType: string
{
	use FilterableEnum;

	case Other = 'other';
	case Jar = 'jar';
	case Can = 'can';
	case Mylar = 'mylar';
	case Vacuum = 'vacuum';
	case Bucket = 'bucket';
	case Loose = 'loose';
	case Frozen = 'freezer';
	case Refrigerator = 'fridge';
	case Braid = 'braid';

	public function label(): string
	{
		return match ($this) {
			self::Other => 'Other',
			self::Jar => 'Glass Jar',
			self::Can => 'Aluminum Can',
			self::Mylar => 'Mylar Bag',
			self::Vacuum => 'Vacuum Sealed Bag',
			self::Bucket => 'Sealed Bucket',
			self::Loose => 'Openly Stored',
			self::Frozen => 'Frozen',
			self::Refrigerator => 'Refrigerator',
			self::Braid => 'Braid'
		};
	}
}
