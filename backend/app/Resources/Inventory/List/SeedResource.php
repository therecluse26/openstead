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
			'name' => $this->variety?->variety_name,
			'variety' => VarietyResource::make($this->variety),
			'quantity' => $this->quantity,
			'life_cycle' => $this->life_cycle?->toFilter(),
			'light_requirement' => $this->light_requirement?->toFilter(),
			'acquired_at' => $this->acquired_at
		];
	}
}