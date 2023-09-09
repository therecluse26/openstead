<?php
namespace App\Resources\Users\List;

use Illuminate\Http\Resources\Json\JsonResource;

class UserListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->user_id ?? $this->id, // If the resource comes from a pivot, use user_id, otherwise use id
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
        ];
    }
}