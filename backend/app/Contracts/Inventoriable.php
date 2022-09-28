<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Relations\MorphMany;

interface Inventoriable
{
	public function inventory(): MorphMany;
}