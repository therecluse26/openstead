<?php

namespace App\Traits;

use App\Models\Variety;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasVariety
{
	public function variety(): HasOne
	{
		return $this->hasOne(Variety::class, 'id', 'variety_id');
	}
}