<?php
namespace App\Resources\Projects\Detail;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectUserResource extends JsonResource 
{
    	public function toArray($request)
	{
		return [
			'id' => $this->id,
            'name' => $this->name,
			'email' => $this->email,
			'avatar' => $this->avatar,
		];
	}
}