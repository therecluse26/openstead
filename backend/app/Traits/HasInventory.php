<?php

namespace App\Traits;

use Illuminate\Support\Collection;

trait HasInventory
{
	public static function getFilters(): Collection
	{
		return collect();
	}

}