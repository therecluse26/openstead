<?php
namespace App\Resources\Authorization\Role;

use Illuminate\Http\Resources\Json\JsonResource;

class RoleListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            ...$this->toDisplay(),
        ];
    }
}