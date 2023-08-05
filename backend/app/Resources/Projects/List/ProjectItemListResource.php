<?php
namespace App\Resources\Projects\List;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectItemListResource extends JsonResource 
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status,
            'assignee' => $this->assignee,
        ];
    }
}