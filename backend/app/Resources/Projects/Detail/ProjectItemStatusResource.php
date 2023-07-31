<?php
namespace App\Resources\Projects\Detail;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectItemStatusResource extends JsonResource 
{
    	public function toArray($request)
	{
		return [
			'key' => $this['id'],
            'label' => $this['status']['name'],
		];
	}
}