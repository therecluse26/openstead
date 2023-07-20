<?php
namespace App\Resources\Projects\Detail;

use App\Models\Projects\ProjectWorkflow;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectWorkflowResource extends JsonResource 
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'columns' => $this->columns,
            'default' => $this->default,
        ];
    }
}