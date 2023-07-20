<?php
namespace App\Models\Projects;

use App\Models\Projects\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Projects\ProjectItemStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ProjectWorkflow extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'project_workflows';

    protected $fillable = [
        'order',
        'default'
    ];

    protected $casts = [
        'order' => 'json',
        'default' => 'boolean'
    ];

    public function scopeDefault()
    {
        return $this->where('default', true)->first();
    }

    public function columns(): Attribute
    {
        return Attribute::make(
            get: fn() => collect($this->order)->map(function ($item) {
                $item['status'] = ProjectItemStatus::where('id', $item['id'])->first();
                return $item;
            }));
    }

    public function project(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'projects', 'project_workflow_id', 'id', 'id', 'id');
    }
}