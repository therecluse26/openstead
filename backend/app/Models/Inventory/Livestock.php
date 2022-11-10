<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\Serviceable;
use App\Contracts\VarietyContract;
use App\Enums\LivestockType;
use App\Enums\Sex;
use App\Resources\FormattedFilter;
use App\Resources\Inventory\Detail\LivestockResource as LivestockDetailResource;
use App\Resources\Inventory\List\LivestockResource as LivestockListResource;
use App\Traits\HasInventory;
use App\Traits\HasNotes;
use App\Traits\HasServiceLogs;
use App\Traits\HasVariety;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Livestock extends Model implements Inventoriable, VarietyContract, FrontendFilterable, HasMedia, Serviceable, Notable
{
	use HasFactory;
	use HasInventory;
	use HasServiceLogs;
	use HasVariety;
	use HasNotes;
	use InteractsWithMedia;

	protected $table = 'livestock';

	protected $fillable = [
		'name',
		'description',
		'variety_id',
		'sex',
		'date_of_birth',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'sex' => Sex::class,
		'date_of_birth' => 'datetime',
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
		return $this->belongsToMany(self::class, 'livestock_parents', 'parent_id', 'livestock_id')->using(LivestockParent::class)->wherePivot('livestock_id', '=', $this->id);
	}

	public function children(): BelongsToMany
	{
		return $this->belongsToMany(self::class, 'livestock_parents', 'livestock_id', 'parent_id')->using(LivestockParent::class)->wherePivot('parent_id', '=', $this->id);
	}

	// Attributes
	public function primaryImage(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->getMedia('images')->first()?->getTemporaryUrl(Carbon::now()->addMinutes(5)) ?? config('icons.fallback.types.livestock')
		);
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(LivestockType::cases())]);
	}

	public function registerMediaConversions(Media $media = null): void
	{
		$this
			->addMediaConversion('preview')
			->fit(Manipulations::FIT_CROP, 300, 300)
			->nonQueued();
	}

}
