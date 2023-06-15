<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VarietyResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'group_type' => $this->group_type->toFilter(),
			'variety_name' => $this->variety_name,
		];
	}
}