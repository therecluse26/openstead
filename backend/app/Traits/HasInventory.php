<?php

namespace App\Traits;

use Illuminate\Support\Collection;

trait HasInventory
{
	public function getFilters(): Collection
	{
		return collect();
	}

}