<?php

namespace App\Resources\Inventory\Detail;

use App\Resources\ServiceLogResource;
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
			'condition_description' => $this->condition_description,
			'primary_image' => $this->primary_image,
			'description' => $this->description,
			'quantity' => $this->quantity,
			'url' => $this->url,
			'acquired_at' => $this->acquired_at,
			'service_logs' => ServiceLogResource::collection($this->serviceLogs->sortByDesc('service_date'))
		];
	}
}