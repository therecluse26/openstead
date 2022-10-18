<?php

namespace App\Traits;

use App\Models\Variety;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasVariety
{
	public function variety(): HasOne
	{
		return $this->hasOne(Variety::class, 'id', 'variety_id');
	}

	public function varietyName(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->variety?->variety_name ?? null
		);
	}

	public function varietyType(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->variety?->group_type ?? null
		);
	}
}