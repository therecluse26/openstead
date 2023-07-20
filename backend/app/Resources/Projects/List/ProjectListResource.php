<?php
namespace App\Resources\Projects\List;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectListResource extends JsonResource 
{
    	public function toArray($request)
	{
		return [
			'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'active' => $this->active,
		];
	}
}