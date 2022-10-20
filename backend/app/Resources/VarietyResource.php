<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VarietyResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'group_type' => $this->group_type,
			'variety_name' => $this->variety_name,
		];
	}
}