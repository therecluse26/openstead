<?php

namespace App\Resources\Inventory\Detail;

use App\Resources\VarietyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class LivestockResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'description' => $this->description,
			'variety' => VarietyResource::make($this->variety),
			'sex' => $this->sex?->toFilter(),
			'quantity' => $this->quantity,
			'date_of_birth' => $this->date_of_birth,
			'date_of_death' => $this->date_of_death,
			'acquired_at' => $this->acquired_at,
			'primary_image' => $this->primary_image,
			'family' => [
				'parents' => LivestockFamilyResource::collection($this->parents),
				'children' => LivestockFamilyResource::collection($this->children),
				'siblings' => LivestockFamilyResource::collection($this->siblings)
			]
		];
	}
}