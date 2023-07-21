<?php
namespace App\Models\Projects;

use App\Contracts\DataTablePaginatable;
use App\Events\Projects\ProjectCreated;
use App\Events\Projects\ProjectDeleted;
use App\Events\Projects\ProjectUpdated;
use App\Models\User;
use App\Models\Projects\ProjectWorkflow;
use App\Resources\Projects\Detail\ProjectDetailResource;
use App\Resources\Projects\List\ProjectListResource;
use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Ramsey\Uuid\Uuid;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Spatie\EventSourcing\Projections\Projection;

class Project extends Projection implements DataTablePaginatable
{
    use HasUuids, HasFactory, HasImages, SoftDeletes;

    protected $table = 'projects';

    protected $primaryKey = 'id';
    
    public function getKeyName()
    {
        return 'id';
    }

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
    
    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['id'];
    }

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

    public static function getFilters(): Collection
    {
        return collect();
    }

	public function getDetailResource(): JsonResource
    {
        return ProjectDetailResource::make($this);
    }

	public function getListResource(): JsonResource
    {
        return ProjectListResource::make($this);
    }

    /**
     * Event-Sourcing Methods
     */
    public function eventCreate(array $attributes){
        $attributes['id'] = (string) Uuid::uuid4();
    
        event(new ProjectCreated($attributes));

        return static::where('id', $attributes['id'])->first();
    }

    public function eventUpdate(array $attributes){    
        event(new ProjectUpdated($attributes));

        return static::find($attributes['id']);
    }

    public function eventDelete(){
        event(new ProjectDeleted($this->toArray()));

        return true;
    }
}