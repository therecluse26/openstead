<?php

namespace App\Resources\Inventory\Detail;

use App\Resources\VarietyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class LivestockFamilyResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'variety' => VarietyResource::make($this->variety),
			'date_of_birth' => $this->date_of_birth,
			'date_of_death' => $this->date_of_death,
			'sex' => $this->sex?->toFilter(),
		];
	}
}