<?php

namespace App\Resources\Inventory\List;

use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'type' => $this->type,
			'condition' => $this->condition,
			'condition_description' => $this->condition_description,
			'description' => $this->description,
			'quantity' => $this->quantity,
			'acquired_at' => $this->acquired_at
		];
	}
}