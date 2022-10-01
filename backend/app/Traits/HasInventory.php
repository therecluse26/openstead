<?php

namespace App\Traits;

use App\Models\Inventory\LocationInventory;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasInventory
{
	public function inventory(): MorphMany
	{
		return $this->morphMany(LocationInventory::class, 'inventoriable');
	}

	public function getQuantityAttribute(): int
	{
		return $this->inventory()->sum('quantity');
	}
}