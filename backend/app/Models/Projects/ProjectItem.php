<?php

namespace App\Models\Projects;

use App\Contracts\AddsMedia;
use App\Resources\Projects\Detail\ProjectItemDetailResource;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;
use App\Traits\HasImages;
use App\Traits\HasNotes;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class ProjectItem extends Model implements AddsMedia, HasMedia {

    use HasUlids, HasNotes, HasFactory, HasImages, SoftDeletes, BelongsToTenant;
    
    protected $table = 'project_items';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'tenant_id',
        'title',
        'description',
        'project_id',
        'project_item_status_id',
        'due_date',
        'assignee_id',
        'completed_at',
        'completed_by',
        'creator_id'
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