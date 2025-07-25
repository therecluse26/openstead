<?php
namespace App\Models\Projects;

use App\Contracts\DataTablePaginatable;
use App\Models\User;
use App\Resources\FormattedFilter;
use App\Resources\Projects\Detail\ProjectDetailResource;
use App\Resources\Projects\List\ProjectListResource;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Project extends Model implements DataTablePaginatable
{
    use HasUlids, HasFactory, SoftDeletes, BelongsToTenant;

    protected $table = 'projects';

    protected $primaryKey = 'id';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'workflow_statuses',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'workflow_statuses' => 'array'
    ];
    
    /**
     * Set the default workflow statuses for a new project
     * Necessary because the database does not support default values for JSON columns
     *
     * @return void
     */
    protected static function booted(): void
    {
        static::creating(function ($project) {
            $statuses = ProjectItemStatus::default()->get();
            $project->workflow_statuses = $statuses->map(function ($status) {
                return  ['id'=> $status->id, 'order' => $status->default_order];
            })->toArray();
        });
    }

    public function workflow(): Attribute
    {
        return Attribute::make(
            get: fn() => collect($this->workflow_statuses)->map(function ($item) {
                $item['status'] = ProjectItemStatus::where('id', (string)$item['id'])->first();
                return $item;
            }));
    }

    public function statuses(): Attribute
    {
        return $this->workflow();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_users', 'project_id', 'user_id')
            ->using(ProjectUser::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProjectItem::class);
    }

    public function owner(): BelongsToMany
    {
        return $this->users()->wherePivot('is_owner', true);
    }

	public function getDetailResource(): JsonResource
    {
        return ProjectDetailResource::make($this);
    }

	public function getListResource(): JsonResource
    {
        return ProjectListResource::make($this);
    }

    public function getFilters(): Collection
	{
		return collect(['statuses' => FormattedFilter::collection($this->statuses)]);
	}
}