<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Casts\PermissionCollection;
use App\Casts\RoleCollection;
use App\Contracts\AddsMedia;
use App\Contracts\DataTablePaginatable;
use App\Contracts\FrontendFilterable;
use App\Contracts\Notable;
use App\Enums\Authorization\Permission;
use Creativeorange\Gravatar\Facades\Gravatar;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectUser;
use App\Resources\Users\Detail\UserWithPermissions;
use App\Resources\Users\List\UserListResource;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\HasImages;
use App\Traits\HasNotes;
use Spatie\MediaLibrary\HasMedia;

class User extends Authenticatable implements DataTablePaginatable, HasMedia, AddsMedia, Notable, FrontendFilterable
{
    use HasUlids, SoftDeletes, HasApiTokens, HasFactory, Notifiable, HasNotes, HasImages;

    /**tenant_users
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
        'avatar_url',
        'roles',
        'permissions'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'roles' => RoleCollection::class,
        'permissions' => PermissionCollection::class,
    ];

    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_users', 'user_id', 'tenant_id')
            ->using(TenantUser::class)
            ->withPivot(['roles', 'permissions']);
    }

    public function getCurrentTenantAttribute()
    {
        return tenant();
    }

    public function avatar(): Attribute
    {
        return Attribute::make(
            get: function() {
                if(!$this->avatar_url){
                    $this->avatar_url = Gravatar::get($this->email);
                    $this->saveQuietly();
                }
                return $this->avatar_url;
            }
        );
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_users', 'user_id', 'project_id')
            ->using(ProjectUser::class);
    }

    public function getRolesAttribute(): Collection
    {
        return $this->tenants->filter(function($tenant){
            return $tenant->id === $this->currentTenant?->id;
        })->map(function($tenant){
            return $tenant->pivot->roles;
        })->flatten();
    }

    public function getPermissionsAttribute(): Collection
    {
        return $this->tenants->filter(function($tenant){
            return $tenant->id === $this->currentTenant?->id;
        })->map(function($tenant){
            return $tenant->pivot->permissions;
        })->flatten();
    }

    // Get permissions from related TenantUser pivot model, filtered by current tenant
    public function getAllPermissionsAttribute(): Collection
    {
        $permissions = $this->roles?->map(function($role){
            return $role->permissions();
        })->flatten() ?? [];

        return $permissions->merge($this->permissions->flatten());
    }

    public function getDisplayPermissionsAttribute(): Collection
    {
        return $this->allPermissions->map(function($permission){
            return $permission->toDisplay();
        });
    }

    public function getDisplayRolesAttribute(): Collection
    {
        return $this->roles->map(function($role){
            return $role->toDisplay();
        });
    }
    
    
    public function hasPermissionTo(Permission $permission): bool
    {
        return $this->allPermissions->contains($permission);
    }
    

    public function getDetailResource(): JsonResource
	{
		return UserWithPermissions::make($this);
	}

	public function getListResource(): JsonResource
	{
		return UserListResource::make($this);
	}

	public function getFilters(): Collection
	{
		return collect();
	}



}
