<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LivestockDropdownResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'key' => $this->id,
			'sex' => $this->sex,
			'label' => ($this->sex ? $this->sex?->label() . " - " : '? - ') . $this->name . " (" . $this->variety->variety_name . ")",
		];
	}
}