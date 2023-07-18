<?php
namespace App\Models\Projects;

use App\Models\Projects\Project;
use App\Models\Projects\ProjectItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function project(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'projects', 'project_workflow_id', 'id');
    }
}