<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FormattedFilter extends JsonResource
{
	public function toArray($request)
	{
		return [
			'key' => $this->value,
			'icon' => $this->when($this->icon(), $this->icon()),
			'label' => $this->when($this->label(), $this->label()),
		];
	}
}