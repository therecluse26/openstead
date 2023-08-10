<?php

namespace App\Resources\Generic\Detail;

use Illuminate\Http\Resources\Json\JsonResource;

class NoteCreatorResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
		];
	}
}