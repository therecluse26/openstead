<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceLogResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'service' => ServiceResource::make($this->service),
			'notes' => $this->notes,
			'service_date' => $this->service_date,
		];
	}
}