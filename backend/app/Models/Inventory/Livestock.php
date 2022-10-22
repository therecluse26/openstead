<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\VarietyContract;
use App\Enums\LivestockType;
use App\Models\Image;
use App\Resources\FormattedFilter;
use App\Traits\HasInventory;
use App\Traits\HasVariety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Collection;

class Livestock extends Model implements Inventoriable, VarietyContract, FrontendFilterable
{
	use HasFactory;
	use HasInventory;
	use HasVariety;

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

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(LivestockType::cases())]);
	}

}
