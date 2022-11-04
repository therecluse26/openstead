<?php

namespace App\Resources\Inventory\List;

use App\Resources\VarietyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class LivestockResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'variety' => VarietyResource::make($this->variety),
			'sex' => $this->sex->toFilter(),
			'quantity' => $this->quantity,
			'date_of_birth' => $this->date_of_birth,
			'acquired_at' => $this->acquired_at
		];
	}
}