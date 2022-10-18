<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

interface VarietyContract
{
	public function variety(): HasOne;

	public function varietyName(): Attribute;

	public function varietyType(): Attribute;
}