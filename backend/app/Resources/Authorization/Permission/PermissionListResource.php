<?php
namespace App\Resources\Authorization\Permission;

use Illuminate\Http\Resources\Json\JsonResource;

class PermissionListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
           ...$this->toDisplay()
        ];
    }
}