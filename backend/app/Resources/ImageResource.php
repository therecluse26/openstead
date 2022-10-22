<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'url' => $this->url,
			'slug' => $this->slug,
			'title' => $this->title,
			'description' => $this->description,
		];
	}
}