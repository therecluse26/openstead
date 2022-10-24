<?php

namespace App\Traits;

use App\Models\Location;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;

trait HasInventory
{
	public function location(): HasOne
	{
		return $this->hasOne(Location::class, 'location_id');
	}

	public static function getFilters(): Collection
	{
		return collect();
	}

}