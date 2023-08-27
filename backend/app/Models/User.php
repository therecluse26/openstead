<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Casts\PermissionCollection;
use App\Casts\RoleCollection;
use App\Casts\RoleEnumCollection;
use Creativeorange\Gravatar\Facades\Gravatar;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectUser;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasUlids, SoftDeletes, HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
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

    public function getAllPermissionsAttribute(): Collection
    {
        $permissions = $this->roles?->map(function($role){
            return $role->permissions();
        })->flatten() ?? [];

        return $permissions->merge($this->permissions->flatten());        
    }
}
