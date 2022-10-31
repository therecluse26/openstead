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
			'acquired_at' => $this->acquired_at
		];
	}
}