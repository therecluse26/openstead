<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Relations\MorphMany;

interface Serviceable
{
	public function serviceLogs(): MorphMany;
}