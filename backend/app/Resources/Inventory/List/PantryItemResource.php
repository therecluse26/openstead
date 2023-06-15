<?php

namespace App\Resources\Inventory\List;

use App\Resources\VarietyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PantryItemResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'variety' => VarietyResource::make($this->variety),
			'quantity' => $this->quantity,
			'expiration_date' => $this->expiration_date
		];
	}
}