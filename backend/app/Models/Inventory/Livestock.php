<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\VarietyContract;
use App\Enums\LivestockType;
use App\Resources\FormattedFilter;
use App\Traits\HasInventory;
use App\Traits\HasVariety;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Livestock extends Model implements Inventoriable, VarietyContract, FrontendFilterable, HasMedia
{
	use HasFactory;
	use HasInventory;
	use HasVariety;
	use InteractsWithMedia;

	protected $table = 'livestock';

	protected $fillable = [
		'name',
		'variety_id',
		'sex',
		'date_of_birth',
		'parent_id',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'date_of_birth' => 'datetime',
		'acquired_at' => 'datetime'
	];

	protected $with = [
		'variety'
	];

	public function parents(): BelongsToMany
	{
		return $this->belongsToMany(self::class)->using(LivestockParent::class)->wherePivot('livestock_id');
	}

	public function children(): BelongsToMany
	{
		return $this->BelongsToMany(self::class)->using(LivestockParent::class)->wherePivot('parent_id');
	}

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
