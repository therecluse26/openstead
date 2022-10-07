<?php

namespace App\Traits;

use App\Models\Location;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasInventory
{
	public function location(): HasOne
	{
		return $this->hasOne(Location::class, 'location_id');
	}

	public function quantity(): Attribute
	{
		return Attribute::make(
			get: static fn($value) => (int)$value,
			set: static fn($value) => (int)$value
		);
	}
}