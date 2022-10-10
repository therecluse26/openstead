<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

interface Inventoriable
{
	public function location(): HasOne;

	public function quantity(): Attribute;

}