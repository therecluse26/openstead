<?php
namespace App\Models\Projects;

use App\Contracts\DataTablePaginatable;
use App\Contracts\FrontendFilterable;
use App\Models\User;
use App\Models\Projects\ProjectWorkflow;
use App\Resources\FormattedFilter;
use App\Resources\Projects\Detail\ProjectDetailResource;
use App\Resources\Projects\List\ProjectListResource;
use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class Project extends Model implements DataTablePaginatable
{
    use HasUlids, HasFactory, HasImages, SoftDeletes;

    protected $table = 'projects';

    protected $primaryKey = 'id';

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
    
    public function workflow(): HasOne
    {
        return $this->hasOne(ProjectWorkflow::class, 'id', 'project_workflow_id')->withDefault(function(){
            return ProjectWorkflow::default();
        });;
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_users', 'project_id', 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProjectItem::class);
    }

	public function getDetailResource(): JsonResource
    {
        return ProjectDetailResource::make($this);
    }

	public function getListResource(): JsonResource
    {
        return ProjectListResource::make($this);
    }

    public function statuses(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->workflow->statuses
        );
    }

    public function getFilters(): Collection
	{
		return collect(['statuses' => FormattedFilter::collection($this->statuses)]);
	}
}