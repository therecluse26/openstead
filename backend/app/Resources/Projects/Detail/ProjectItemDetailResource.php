<?php
namespace App\Resources\Projects\Detail;

use App\Resources\Projects\List\ProjectItemListResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectItemDetailResource extends JsonResource 
{
    	public function toArray($request)
	{
		return [
			'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
			'status' => $this->status,
			'assignee' => $this->assignee,
			'created_at' => $this->created_at,
			'creator' => $this->creator,
			'updated_at' => $this->updated_at,
			'due_date' => $this->due_date,
			'deleted_at' => $this->deleted_at,
			'completed_at' => $this->completed_at,
			'completed_by' => $this->completed_by,
			'notes' => $this->notes,
		];
	}
}