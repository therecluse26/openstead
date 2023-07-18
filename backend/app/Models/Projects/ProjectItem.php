<?php

namespace App\Models\Projects;

use App\Events\Projects\ProjectItemCreated;
use App\Events\Projects\ProjectItemDeleted;
use App\Events\Projects\ProjectItemUpdated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Ramsey\Uuid\Uuid;

class ProjectItem extends Model {

    use HasFactory, SoftDeletes;
    
    protected $table = 'project_items';

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'project_item_status_id',
        'due_date',
        'completed_at',
        'completed_by',
    
    ];

    protected $dates = [
        'due_date',
        'completed_at',
        'created_at',
        'updated_at',
        'deleted_at',
    
    ];

    protected $casts = [
        'id' => 'integer',
        'project_id' => 'integer',
        'project_item_status_id' => 'integer',
        'due_date' => 'date',
        'completed_at' => 'datetime',
        'completed_by' => 'integer',
    
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ProjectItemStatus::class);
    }

    public function eventCreate(array $attributes){
        $attributes['uuid'] = (string) Uuid::uuid4();
    
        event(new ProjectItemCreated($attributes));

        return static::uuid($attributes['id']);
    }

    public function eventUpdate(array $attributes){    
        event(new ProjectItemUpdated($attributes));

        return static::uuid($attributes['id']);
    }

    public function eventDelete(){
    
        event(new ProjectItemDeleted($this->toArray()));

        return true;
    }

}