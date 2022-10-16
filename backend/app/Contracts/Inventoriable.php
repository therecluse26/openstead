<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;

interface Inventoriable
{
	public function location(): HasOne;

	public function quantity(): Attribute;

	public static function getFilters(): Collection;

}