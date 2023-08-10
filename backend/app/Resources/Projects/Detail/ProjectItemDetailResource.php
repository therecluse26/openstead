<?php
namespace App\Resources\Projects\Detail;

use App\Resources\Generic\Detail\NoteResource;
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
			'assignee' => ProjectUserResource::make($this->assignee),
			'created_at' => $this->created_at,
			'creator' => ProjectUserResource::make($this->creator),
			'updated_at' => $this->updated_at,
			'due_date' => $this->due_date,
			'deleted_at' => $this->deleted_at,
			'completed_at' => $this->completed_at,
			'completed_by' => ProjectUserResource::make($this->completed_by),
			'notes' => NoteResource::collection($this->notes),
		];
	}
}