<?php

namespace App\Resources\Inventory\Detail;

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
			'primary_image' => $this->primary_image,
			'description' => $this->description,
			'expiration_date' => $this->expiration_date
		];
	}
}