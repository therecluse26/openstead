<?php

namespace App\Resources\Generic\Detail;

use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'note' => $this->note,
			'creator' => NoteCreatorResource::make($this->creator),
			'timestamp' => $this->updated_at
		];
	}
}