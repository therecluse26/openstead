<?php

namespace App\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceLogResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'service' => ServiceResource::make($this->service),
			'notes' => $this->notes,
			'service_date' => Carbon::parse($this->service_date)->toDateTimeString(),
		];
	}
}