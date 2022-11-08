<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VarietyDropdownResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'key' => $this->id,
			'label' => $this->variety_name,
		];
	}
}