<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'type' => $this->type?->toFilter(),
			'title' => $this->title,
			'description' => $this->description,
		];
	}
}