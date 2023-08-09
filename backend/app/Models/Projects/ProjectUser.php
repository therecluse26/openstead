<?php
namespace App\Models\Projects;

use App\Models\Users\User;
use App\Models\Projects\Project;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    use HasUlids, HasFactory;

    protected $table = 'project_users';

    protected $primaryKey = 'id';

    protected $fillable = [
        'project_id',
        'user_id',
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