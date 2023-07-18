<?php
namespace App\Models\Projects;

use App\Enums\ProjectRole;
use App\Models\Users\User;
use App\Models\Projects\Project;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    use HasFactory;

    protected $table = 'project_users';

    protected $fillable = [
        'project_id',
        'user_id',
        'role'
    ];

    protected $casts = [
        'role' => ProjectRole::class
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}