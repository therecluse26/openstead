<?php
namespace App\Resources\Users\Detail;

use Illuminate\Http\Resources\Json\JsonResource;

class UserWithPermissions extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'roles' => $this->roles,
            'allPermissions' => $this->allPermissions,
            'currentTenant' => $this->currentTenant,
            'tenants' => $this->tenants->map(function ($tenant) {
                return [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                ];
            })
        ];
    }
}