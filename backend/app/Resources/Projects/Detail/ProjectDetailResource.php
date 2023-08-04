<?php
namespace App\Resources\Projects\Detail;

use App\Resources\Projects\List\ProjectItemListResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailResource extends JsonResource 
{
    	public function toArray($request)
	{
		return [
			'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'active' => $this->active,
			'items' => ProjectItemListResource::collection($this->items),
			'users' => ProjectUserResource::collection($this->users),
            'workflow' => $this->workflow, 
		];
	}
}