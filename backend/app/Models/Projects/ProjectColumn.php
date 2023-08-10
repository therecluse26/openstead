<?php
namespace App\Models\Projects;

use App\Models\Projects\Project;
use App\Models\Projects\ProjectItem;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProjectColumn extends Model
{
    use HasUlids, HasFactory, SoftDeletes;

    protected $table = 'project_columns';

    protected $fillable = [
        'title',
        'order',
        'project_id',
        'project_item_status_id',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ProjectItemStatus::class, 'project_item_status_id');
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(ProjectItem::class, 'project_item_status_id', 'project_item_status_id', 'id' );
    }
}