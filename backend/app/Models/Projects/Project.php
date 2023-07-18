<?php
namespace App\Models\Projects;

use App\Events\Projects\ProjectCreated;
use App\Events\Projects\ProjectDeleted;
use App\Events\Projects\ProjectUpdated;
use App\Models\Users\User;
use App\Models\Workflows\Workflow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Ramsey\Uuid\Uuid;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'active',
        'project_workflow_id'
    ];

    protected $casts = [
        'active' => 'boolean'
    ];

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class, 'project_workflow_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_users', 'project_id', 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProjectItem::class);
    }

    public function eventCreate(array $attributes){
        $attributes['uuid'] = (string) Uuid::uuid4();
    
        event(new ProjectCreated($attributes));

        return static::uuid($attributes['id']);
    }

    public function eventUpdate(array $attributes){    
        event(new ProjectUpdated($attributes));

        return static::uuid($attributes['id']);
    }

    public function eventDelete(){
    
        event(new ProjectDeleted($this->toArray()));

        return true;
    }
}