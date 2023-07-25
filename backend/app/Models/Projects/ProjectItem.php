<?php

namespace App\Models\Projects;

use App\Resources\Projects\Detail\ProjectItemDetailResource;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;

class ProjectItem extends Model {

    use HasUuids, HasFactory, SoftDeletes;
    
    protected $table = 'project_items';

    protected $primaryKey = 'id';
    
    public function getKeyName()
    {
        return 'id';
    }

    protected $fillable = [
        'id',
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
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ProjectItemStatus::class, 'project_item_status_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by_id');
    }

    public function getDetailResource(): JsonResource
    {
        return ProjectItemDetailResource::make($this);
    }

}