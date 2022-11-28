<?php

namespace App\Resources\Inventory\List;

use App\Resources\VarietyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class SeedResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'variety' => VarietyResource::make($this->variety),
			'quantity' => $this->quantity,
			'life_cycle' => $this->life_cycle?->toFilter(),
			'light_requirement' => $this->light_requirement?->toFilter(),
			'zone_lower' => $this->zone_lower?->toFilter(),
			'zone_upper' => $this->zone_upper?->toFilter(),
			'acquired_at' => $this->acquired_at
		];
	}
}