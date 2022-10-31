<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceDropdownResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'key' => $this->id,
			'label' => $this->title,
		];
	}
}