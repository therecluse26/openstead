<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Relations\HasOne;

interface VarietyContract
{
	public function variety(): HasOne;

}