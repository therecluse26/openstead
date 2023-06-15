<?php

namespace App\Resources\Inventory\Detail;

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
			'acquired_at' => $this->acquired_at,
			'primary_image' => $this->primary_image,
			'description' => $this->description,
			'life_cycle' => $this->life_cycle?->toFilter(),
			'light_requirement' => $this->light_requirement?->toFilter(),
			'zone_lower' => $this->zone_lower?->toFilter(),
			'zone_upper' => $this->zone_upper?->toFilter(),
			'days_to_germination' => $this->days_to_germination,
			'days_to_maturity' => $this->days_to_maturity,
			'planting_depth' => $this->planting_depth,
			'plant_spacing' => $this->plant_spacing,
			'url' => $this->url
		];
	}
}