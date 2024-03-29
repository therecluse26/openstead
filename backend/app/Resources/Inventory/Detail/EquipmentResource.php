<?php

namespace App\Resources\Inventory\Detail;

use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'type' => $this->type->toFilter(),
			'condition' => $this->condition,
			'rating' => $this->rating,
			'condition_description' => $this->condition_description,
			'primary_image' => $this->primary_image,
			'description' => $this->description,
			'quantity' => $this->quantity,
			'url' => $this->url,
			'acquired_at' => $this->acquired_at,
		];
	}
}