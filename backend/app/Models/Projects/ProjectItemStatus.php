<?php
namespace App\Models\Projects;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectItemStatus extends Model
{
    use HasUlids, HasFactory, SoftDeletes;

    protected $table = 'project_item_statuses';
    
    protected $primaryKey = 'id';
    
    public function getKeyName()
    {
        return 'id';
    }

    protected $fillable = [
        'id',
        'name',
        'description',
        'color'
    ];

    protected $casts = [
        'color' => 'string'
    ];
    
    public function items(): BelongsToMany
    {
        return $this->belongsToMany(ProjectItem::class, 'project_items', 'project_item_status_id', 'id', 'id', 'id');
    }
}