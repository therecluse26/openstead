<?php

namespace App\Models\Inventory;

use App\Contracts\AddsMedia;
use App\Contracts\DataTablePaginatable;
use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\Serviceable;
use App\Contracts\VarietyContract;
use App\Enums\AnimalType;
use App\Enums\Sex;
use App\Models\Scopes\AliveScope;
use App\Resources\FormattedFilter;
use App\Resources\Inventory\Detail\LivestockResource as LivestockDetailResource;
use App\Resources\Inventory\List\LivestockResource as LivestockListResource;
use App\Traits\HasInventory;
use App\Traits\HasNotes;
use App\Traits\HasServiceLogs;
use App\Traits\HasVariety;
use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\HasMedia;

class Livestock extends Model implements DataTablePaginatable, Inventoriable, VarietyContract, FrontendFilterable, HasMedia, AddsMedia, Serviceable, Notable
{
	use HasUlids;
	use HasFactory;
	use HasInventory;
	use HasServiceLogs;
	use HasVariety;
	use HasNotes;
	use HasImages;

	protected $table = 'livestock';

	protected $fillable = [
		'name',
		'description',
		'variety_id',
		'sex',
		'date_of_birth',
		'date_of_death',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'sex' => Sex::class,
		'date_of_birth' => 'datetime',
		'date_of_death' => 'datetime',
		'acquired_at' => 'datetime'
	];

	protected $with = [
		'variety',
	];

	public static function boot()
	{
		parent::boot();
		self::deleting(function ($model) {
			$model->serviceLogs()->each(function ($r) {
				$r->delete();
			});
			$model->parents()->detach();
			$model->children()->detach();
		});
	}

	protected static function booted()
	{
		static::addGlobalScope(new AliveScope);
	}

	// API Resources
	public function getDetailResource(): JsonResource
	{
		return LivestockDetailResource::make($this);
	}

	public function getListResource(): JsonResource
	{
		return LivestockListResource::make($this);
	}

	// Relationships
	public function parents(): BelongsToMany
	{
		return $this->belongsToMany(self::class, 'livestock_parents', 'livestock_id', 'parent_id')
			->using(LivestockParent::class)
			->wherePivot('livestock_id', '=', $this->id)
			->withoutGlobalScope(AliveScope::class);
	}

	public function children(): BelongsToMany
	{
		return $this->belongsToMany(self::class, 'livestock_parents', 'parent_id', 'livestock_id')
			->using(LivestockParent::class)
			->wherePivot('parent_id', '=', $this->id)
			->withoutGlobalScope(AliveScope::class);
	}

	// Accessors
	public function siblings(): Attribute
	{
		return Attribute::make(
			get: function () {
				return $this->parents->flatMap(function ($parent) {
					return $parent->children()
						->whereNot('livestock.id', $this->id)
						->get();
				})->unique();
			}
		);
	}

	// Other methods
	public function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(AnimalType::cases())]);
	}
}
