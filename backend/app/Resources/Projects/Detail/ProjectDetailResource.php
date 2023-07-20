<?php
namespace App\Resources\Projects\Detail;

use App\Models\Projects\ProjectWorkflow;
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
            'workflow' => ProjectWorkflowResource::make($this->workflow), 
		];
	}
}